const recordButton = document.getElementById('recordButton');
const sendButton = document.getElementById('sendButton');
const textInput = document.getElementById('textInput');
const chatMessages = document.getElementById('chatMessages');
const errorDiv = document.getElementById('error');
const characterSelect = document.getElementById('characterSelect');
const languageSelect = document.getElementById('languageSelect');

// Handle speech input
recordButton.addEventListener('click', async () => {
    recordButton.disabled = true;
    recordButton.textContent = 'Recording... (5 seconds)';
    errorDiv.style.display = 'none';

    try {
        const response = await fetch('/process_audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                character: characterSelect.value,
                language: languageSelect.value 
            })
        });

        const data = await response.json();

        if (response.ok) {
            addMessage(data.transcript, true, data.character, data.recorded_audio_url);
            addMessage(data.response, false, data.character, data.synthesized_audio_url);
            // Optionally sync full conversation history (uncomment if needed)
            // syncConversation(data.conversation);
        } else {
            errorDiv.textContent = data.error || 'An error occurred while processing the audio.';
            errorDiv.style.display = 'block';
        }
    } catch (err) {
        errorDiv.textContent = 'An error occurred: ' + err.message;
        errorDiv.style.display = 'block';
    } finally {
        recordButton.disabled = false;
        recordButton.textContent = '🎤 Record';
    }
});

// Handle text input
sendButton.addEventListener('click', async () => {
    const text = textInput.value.trim();
    if (!text) return;

    addMessage(text, true, characterSelect.value);
    textInput.value = '';
    errorDiv.style.display = 'none';

    try {
        const response = await fetch('/process_text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text, 
                character: characterSelect.value,
                language: languageSelect.value 
            })
        });

        const data = await response.json();

        if (response.ok) {
            addMessage(data.response, false, data.character, data.synthesized_audio_url);
            // Optionally sync full conversation history (uncomment if needed)
            // syncConversation(data.conversation);
        } else {
            errorDiv.textContent = data.error || 'An error occurred while processing the text.';
            errorDiv.style.display = 'block';
        }
    } catch (err) {
        errorDiv.textContent = 'An error occurred: ' + err.message;
        errorDiv.style.display = 'block';
    }
});

// Allow pressing Enter to send text
textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendButton.click();
});

// Language change notification
languageSelect.addEventListener('change', () => {
    const selectedLanguage = languageSelect.options[languageSelect.selectedIndex].text;
    errorDiv.textContent = `Language changed to ${selectedLanguage}`;
    errorDiv.style.display = 'block';
    errorDiv.style.color = 'green';
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
});

// Optional: Sync full conversation history from Firebase
function syncConversation(conversation) {
    chatMessages.innerHTML = ''; // Clear existing messages
    conversation.forEach(conv => {
        addMessage(conv.user_input, true, conv.character, conv.recorded_audio_url);
        addMessage(conv.response, false, conv.character, conv.synthesized_audio_url);
    });
}