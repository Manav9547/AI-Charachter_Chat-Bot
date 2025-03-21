from flask import Flask, render_template, request, jsonify
import os
import time
import atexit
import signal
import json
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, storage
from transcribe_audio import transcribe_audio
from tts import text_to_speech, translate_text
from gemini_api import get_character_response

app = Flask(__name__)

# Load environment variables from .env file (for local development)
load_dotenv()

# Load Firebase credentials from environment variable
firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")
if not firebase_credentials:
    raise ValueError("FIREBASE_CREDENTIALS environment variable not set")

# Parse the JSON string into a dictionary
try:
    cred_dict = json.loads(firebase_credentials)
except json.JSONDecodeError as e:
    raise ValueError(f"Failed to parse FIREBASE_CREDENTIALS as JSON: {str(e)}")

# Initialize Firebase with the credentials
cred = credentials.Certificate(cred_dict)
firebase_admin.initialize_app(cred, {'storageBucket': 'shinchan-bot-454207.appspot.com'})
db = firestore.client()
bucket = storage.bucket()

# Create a directory for temporary audio files
UPLOAD_FOLDER = "static/audio"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def clear_collection(ip_address):
    collection_name = ip_address.replace('.', '_')
    print(f"Clearing Firestore '{collection_name}' collection...")
    docs = db.collection(collection_name).stream()
    for doc in docs:
        doc.reference.delete()

def clear_storage(ip_address):
    prefix = f"audio/{ip_address.replace('.', '_')}/"
    print(f"Clearing Firebase Storage '{prefix}' folder...")
    blobs = bucket.list_blobs(prefix=prefix)
    for blob in blobs:
        blob.delete()

def cleanup_all():
    print("Cleaning up all Firebase data...")
    collections = db.collections()
    for collection in collections:
        for doc in collection.stream():
            doc.reference.delete()
    blobs = bucket.list_blobs(prefix="audio/")
    for blob in blobs:
        blob.delete()

# Clear all data on server startup
cleanup_all()

# Register cleanup on exit
atexit.register(cleanup_all)

def handle_shutdown(signal, frame):
    print("Received SIGINT (Ctrl+C). Performing cleanup...")
    cleanup_all()
    exit(0)

signal.signal(signal.SIGINT, handle_shutdown)

@app.route('/')
def index():
    ip_address = request.remote_addr.replace('.', '_')
    conversation_ref = db.collection(ip_address).order_by('timestamp')
    conversation = [doc.to_dict() for doc in conversation_ref.stream()]
    print(f"Loaded conversation for IP {ip_address}: {len(conversation)} messages")
    return render_template('index.html', conversation=conversation, ip_address=ip_address)

@app.route('/process_audio', methods=['POST'])
def process_audio():
    recorded_audio_path = None
    synthesized_audio_path = None
    try:
        ip_address = request.remote_addr.replace('.', '_')
        character = request.form.get('character', 'jax')
        selected_language = request.form.get('language', 'en-US')
        
        if not selected_language:
            return jsonify({"error": "No language selected"}), 400

        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        audio_file = request.files['audio']
        timestamp = str(time.time_ns())
        recorded_audio_path = f"{UPLOAD_FOLDER}/recorded_audio_{timestamp}.wav"
        audio_file.save(recorded_audio_path)

        recorded_blob_path = f"audio/{ip_address}/recorded_audio_{timestamp}.wav"
        recorded_blob = bucket.blob(recorded_blob_path)
        recorded_blob.upload_from_filename(recorded_audio_path)
        recorded_blob.make_public()
        recorded_audio_url = recorded_blob.public_url
        print(f"Uploaded recorded audio to {recorded_blob_path}: {recorded_audio_url}")

        transcript = transcribe_audio(recorded_audio_path, language=selected_language)
        if not transcript:
            return jsonify({"error": "Transcription failed or no speech detected"}), 500
        print(f"Transcription successful: '{transcript}'")

        target_language = selected_language.split("-")[0]
        transcript_en = translate_text(transcript, "en")
        response_en = get_character_response(transcript_en, "en-US", character)
        if "Error" in response_en:
            return jsonify({"error": f"Failed to get response: {response_en}"}), 500

        response = translate_text(response_en, target_language)
        synthesized_audio_path = f"{UPLOAD_FOLDER}/synthesized_audio_{timestamp}.mp3"
        text_to_speech(response, selected_language, character, synthesized_audio_path)
        print(f"Synthesized audio saved to {synthesized_audio_path}")

        synthesized_blob_path = f"audio/{ip_address}/synthesized_audio_{timestamp}.mp3"
        synthesized_blob = bucket.blob(synthesized_blob_path)
        synthesized_blob.upload_from_filename(synthesized_audio_path)
        synthesized_blob.make_public()
        synthesized_audio_url = synthesized_blob.public_url
        print(f"Uploaded synthesized audio to {synthesized_blob_path}: {synthesized_audio_url}")

        conversation_ref = db.collection(ip_address)
        conversation_ref.add({
            'user_input_id': f"user_input_{timestamp}",
            'timestamp': firestore.SERVER_TIMESTAMP,
            'user_input': transcript,
            'response': response,
            'character': character,
            'selected_language': selected_language,
            'recorded_audio_url': recorded_audio_url,
            'synthesized_audio_url': synthesized_audio_url
        })

        conversation = [doc.to_dict() for doc in conversation_ref.order_by('timestamp').stream()]
        
        return jsonify({
            "transcript": transcript,
            "response": response,
            "character": character,
            "selected_language": selected_language,
            "recorded_audio_url": recorded_audio_url,
            "synthesized_audio_url": synthesized_audio_url,
            "conversation": conversation
        })
    except Exception as e:
        import traceback
        print(f"Error in process_audio: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500
    finally:
        if recorded_audio_path and os.path.exists(recorded_audio_path):
            os.remove(recorded_audio_path)
        if synthesized_audio_path and os.path.exists(synthesized_audio_path):
            os.remove(synthesized_audio_path)

@app.route('/process_text', methods=['POST'])
def process_text():
    synthesized_audio_path = None
    try:
        ip_address = request.remote_addr.replace('.', '_')
        data = request.get_json()
        text = data.get('text', '').strip()
        character = data.get('character', 'jax')
        selected_language = data.get('language', 'en-US')
        
        if not selected_language:
            return jsonify({"error": "No language selected"}), 400
        if not text:
            return jsonify({"error": "No text provided"}), 400

        full_language_code = selected_language
        target_language = selected_language.split("-")[0]

        text_en = translate_text(text, "en")
        response_en = get_character_response(text_en, "en-US", character)
        if "Error" in response_en:
            return jsonify({"error": f"Failed to get response: {response_en}"}), 500

        response = translate_text(response_en, target_language)
        timestamp = str(time.time_ns())
        user_input_id = f"user_input_{timestamp}"
        synthesized_audio_path = f"{UPLOAD_FOLDER}/synthesized_audio_{timestamp}.mp3"
        text_to_speech(response, full_language_code, character, synthesized_audio_path)
        print(f"Synthesized audio saved to {synthesized_audio_path}")

        synthesized_blob_path = f"audio/{ip_address}/synthesized_audio_{timestamp}.mp3"
        synthesized_blob = bucket.blob(synthesized_blob_path)
        synthesized_blob.upload_from_filename(synthesized_audio_path)
        synthesized_blob.make_public()
        synthesized_audio_url = synthesized_blob.public_url
        print(f"Uploaded synthesized audio to {synthesized_blob_path}: {synthesized_audio_url}")

        conversation_ref = db.collection(ip_address)
        conversation_ref.add({
            'user_input_id': user_input_id,
            'timestamp': firestore.SERVER_TIMESTAMP,
            'user_input': text,
            'response': response,
            'character': character,
            'selected_language': full_language_code,
            'recorded_audio_url': None,
            'synthesized_audio_url': synthesized_audio_url
        })

        conversation = [doc.to_dict() for doc in conversation_ref.order_by('timestamp').stream()]
        
        return jsonify({
            "transcript": text,
            "response": response,
            "character": character,
            "selected_language": full_language_code,
            "recorded_audio_url": None,
            "synthesized_audio_url": synthesized_audio_url,
            "conversation": conversation
        })
    except Exception as e:
        import traceback
        print(f"Error in process_text: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500
    finally:
        if synthesized_audio_path and os.path.exists(synthesized_audio_path):
            os.remove(synthesized_audio_path)

@app.route('/clear_chat', methods=['POST'])
def clear_chat():
    try:
        data = request.get_json()
        ip_address = data.get('ip_address')
        if not ip_address:
            return jsonify({"error": "No IP address provided"}), 400
        
        clear_collection(ip_address)
        clear_storage(ip_address)
        print(f"Cleared chat for IP: {ip_address}")
        return jsonify({"message": "Chat cleared"}), 200
    except Exception as e:
        print(f"Error in clear_chat: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5003))  # Use Render's PORT env var or default to 5003 for local dev
    app.run(debug=False, host="0.0.0.0", port=port)
