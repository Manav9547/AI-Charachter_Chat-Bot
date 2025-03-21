// const recordButton = document.getElementById('recordButton');
// const sendButton = document.getElementById('sendButton');
// const textInput = document.getElementById('textInput');
// const chatMessages = document.getElementById('chatMessages');
// const errorDiv = document.getElementById('error');
// const characterSelect = document.getElementById('characterSelect');
// const languageSelect = document.getElementById('languageSelect');

// const ipAddress = document.currentScript.getAttribute('data-ip');

// // Flag to track if the page is being reloaded
// let isReloading = false;

// recordButton.addEventListener('click', async () => {
//     recordButton.disabled = true;
//     recordButton.textContent = 'Recording... (5 seconds)';
//     errorDiv.style.display = 'none';

//     try {
//         const response = await fetch('/process_audio', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//                 character: characterSelect.value,
//                 language: languageSelect.value 
//             })
//         });

//         const data = await response.json();

//         if (response.ok) {
//             addMessage(data.transcript, true, data.character, data.recorded_audio_url);
//             addMessage(data.response, false, data.character, data.synthesized_audio_url);
//         } else {
//             errorDiv.textContent = data.error || 'An error occurred while processing the audio.';
//             errorDiv.style.display = 'block';
//         }
//     } catch (err) {
//         errorDiv.textContent = 'An error occurred: ' + err.message;
//         errorDiv.style.display = 'block';
//     } finally {
//         recordButton.disabled = false;
//         recordButton.textContent = '🎤 Record';
//     }
// });

// sendButton.addEventListener('click', async () => {
//     const text = textInput.value.trim();
//     if (!text) return;

//     addMessage(text, true, characterSelect.value);
//     textInput.value = '';
//     errorDiv.style.display = 'none';

//     try {
//         const response = await fetch('/process_text', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//                 text, 
//                 character: characterSelect.value,
//                 language: languageSelect.value 
//             })
//         });

//         const data = await response.json();

//         if (response.ok) {
//             addMessage(data.response, false, data.character, data.synthesized_audio_url);
//         } else {
//             errorDiv.textContent = data.error || 'An error occurred while processing the text.';
//             errorDiv.style.display = 'block';
//         }
//     } catch (err) {
//         errorDiv.textContent = 'An error occurred: ' + err.message;
//         errorDiv.style.display = 'block';
//     }
// });

// textInput.addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') sendButton.click();
// });

// languageSelect.addEventListener('change', () => {
//     const selectedLanguage = languageSelect.options[languageSelect.selectedIndex].text;
//     errorDiv.textContent = `Language changed to ${selectedLanguage}`;
//     errorDiv.style.display = 'block';
//     errorDiv.style.color = 'green';
//     setTimeout(() => {
//         errorDiv.style.display = 'none';
//     }, 3000);
// });

// function syncConversation(conversation) {
//     chatMessages.innerHTML = ''; // Clear existing messages
//     conversation.forEach(conv => {
//         addMessage(conv.user_input, true, conv.character, conv.recorded_audio_url);
//         addMessage(conv.response, false, conv.character, conv.synthesized_audio_url);
//     });
// }

// // Detect reload intent
// window.addEventListener('beforeunload', (event) => {
//     // Check if the page is being reloaded (e.g., F5, Ctrl+R, or browser refresh button)
//     if (event.currentTarget.performance.navigation.type === 1) {
//         isReloading = true;
//     }
// });

// // Cleanup only on tab close, not reload
// window.addEventListener('unload', () => {
//     if (!isReloading) {
//         const data = JSON.stringify({ ip_address: ipAddress });
//         const blob = new Blob([data], { type: 'application/json' });
//         navigator.sendBeacon('/cleanup', blob);
//         console.log('Tab closed, cleanup signal sent');
//     } else {
//         console.log('Page reloaded, no cleanup');
//     }
// });

// // Reset reload flag after load
// window.addEventListener('load', () => {
//     isReloading = false;
// });

// // Load initial conversation
// syncConversation(initialConversation);











// const recordButton = document.getElementById('recordButton');
// const sendButton = document.getElementById('sendButton');
// const textInput = document.getElementById('textInput');
// const chatMessages = document.getElementById('chatMessages');
// const errorDiv = document.getElementById('error');
// const characterSelect = document.getElementById('characterSelect');
// const languageSelect = document.getElementById('languageSelect');
// const clearChatButton = document.getElementById('clearChatButton');

// const ipAddress = document.currentScript.getAttribute('data-ip');

// recordButton.addEventListener('click', async () => {
//     recordButton.disabled = true;
//     recordButton.textContent = 'Recording... (5 seconds)';
//     errorDiv.style.display = 'none';

//     try {
//         const response = await fetch('/process_audio', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//                 character: characterSelect.value,
//                 language: languageSelect.value 
//             })
//         });

//         const data = await response.json();

//         if (response.ok) {
//             addMessage(data.transcript, true, data.character, data.recorded_audio_url);
//             addMessage(data.response, false, data.character, data.synthesized_audio_url);
//         } else {
//             errorDiv.textContent = data.error || 'An error occurred while processing the audio.';
//             errorDiv.style.display = 'block';
//         }
//     } catch (err) {
//         errorDiv.textContent = 'An error occurred: ' + err.message;
//         errorDiv.style.display = 'block';
//     } finally {
//         recordButton.disabled = false;
//         recordButton.textContent = '🎤 Record';
//     }
// });

// sendButton.addEventListener('click', async () => {
//     const text = textInput.value.trim();
//     if (!text) return;

//     addMessage(text, true, characterSelect.value);
//     textInput.value = '';
//     errorDiv.style.display = 'none';

//     try {
//         const response = await fetch('/process_text', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//                 text, 
//                 character: characterSelect.value,
//                 language: languageSelect.value 
//             })
//         });

//         const data = await response.json();

//         if (response.ok) {
//             addMessage(data.response, false, data.character, data.synthesized_audio_url);
//         } else {
//             errorDiv.textContent = data.error || 'An error occurred while processing the text.';
//             errorDiv.style.display = 'block';
//         }
//     } catch (err) {
//         errorDiv.textContent = 'An error occurred: ' + err.message;
//         errorDiv.style.display = 'block';
//     }
// });

// textInput.addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') sendButton.click();
// });

// languageSelect.addEventListener('change', () => {
//     const selectedLanguage = languageSelect.options[languageSelect.selectedIndex].text;
//     errorDiv.textContent = `Language changed to ${selectedLanguage}`;
//     errorDiv.style.display = 'block';
//     errorDiv.style.color = 'green';
//     setTimeout(() => {
//         errorDiv.style.display = 'none';
//     }, 3000);
// });

// function syncConversation(conversation) {
//     chatMessages.innerHTML = ''; // Clear existing messages
//     conversation.forEach(conv => {
//         addMessage(conv.user_input, true, conv.character, conv.recorded_audio_url);
//         addMessage(conv.response, false, conv.character, conv.synthesized_audio_url);
//     });
// }

// // Clear chat functionality
// clearChatButton.addEventListener('click', async () => {
//     try {
//         const response = await fetch('/clear_chat', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ ip_address: ipAddress })
//         });

//         const data = await response.json();

//         if (response.ok) {
//             chatMessages.innerHTML = ''; // Clear the UI
//             errorDiv.textContent = 'Chat cleared successfully!';
//             errorDiv.style.display = 'block';
//             errorDiv.style.color = 'green';
//             setTimeout(() => {
//                 errorDiv.style.display = 'none';
//             }, 3000);
//         } else {
//             errorDiv.textContent = data.error || 'Failed to clear chat.';
//             errorDiv.style.display = 'block';
//             errorDiv.style.color = 'red';
//         }
//     } catch (err) {
//         errorDiv.textContent = 'An error occurred: ' + err.message;
//         errorDiv.style.display = 'block';
//         errorDiv.style.color = 'red';
//     }
// });

// // Load initial conversation
// syncConversation(initialConversation);




























const recordButton = document.getElementById('recordButton');
const sendButton = document.getElementById('sendButton');
const textInput = document.getElementById('textInput');
const chatMessages = document.getElementById('chatMessages');
const errorDiv = document.getElementById('error');
const languageSelect = document.getElementById('languageSelect');
const clearChatButton = document.getElementById('clearChatButton');

const ipAddress = document.currentScript.getAttribute('data-ip');

// Flag to track if the page is being reloaded
let isReloading = false;

// Variables for audio recording
let mediaRecorder;
let audioChunks = [];

// Show loading animation
async function showLoading(isRecording = false) {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('loading-message');
    loadingDiv.textContent = isRecording ? 'Recording & Processing...' : 'Processing...';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loadingDiv;
}

// Remove loading animation
function removeLoading(loadingDiv) {
    if (loadingDiv) loadingDiv.remove();
}

// Add a message to the chat with optional audio playback
function addMessage(message, isUser, character, audioUrl = null) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isUser ? 'user-message' : 'bot-message');
    
    const prefix = isUser ? 'You' : character;
    messageDiv.innerHTML = `<strong>${prefix}:</strong> ${message}`;
    
    if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play().catch(err => {
            console.error('Error playing audio:', err);
        });
        const audioLink = document.createElement('a');
        audioLink.href = audioUrl;
        audioLink.textContent = ' [Listen]';
        audioLink.style.color = '#007bff';
        messageDiv.appendChild(audioLink);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Sync conversation history from server
function syncConversation(conversation) {
    chatMessages.innerHTML = ''; // Clear existing messages
    conversation.forEach(conv => {
        addMessage(conv.user_input, true, conv.character, conv.recorded_audio_url);
        addMessage(conv.response, false, conv.character, conv.synthesized_audio_url);
    });
}

// Handle speech input with client-side recording
recordButton.addEventListener('click', async () => {
    if (recordButton.classList.contains('recording')) {
        // Stop recording
        mediaRecorder.stop();
        recordButton.classList.remove('recording');
        recordButton.innerHTML = '<img src="/static/mic_button.png" alt="Record" class="button-icon">';
        recordButton.disabled = true;
    } else {
        // Start recording
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const formData = new FormData();
                formData.append('audio', audioBlob, 'recorded_audio.wav');
                formData.append('character', selectedCharacter);
                formData.append('language', languageSelect.value);

                const loadingDiv = await showLoading(true);
                errorDiv.style.display = 'none';

                try {
                    const response = await fetch('/process_audio', {
                        method: 'POST',
                        body: formData
                    });

                    const data = await response.json();

                    if (response.ok) {
                        addMessage(data.transcript, true, data.character, data.recorded_audio_url);
                        addMessage(data.response, false, data.character, data.synthesized_audio_url);
                    } else {
                        errorDiv.textContent = data.error || 'An error occurred while processing the audio.';
                        errorDiv.style.display = 'block';
                        errorDiv.style.color = 'red';
                    }
                } catch (err) {
                    errorDiv.textContent = 'An error occurred: ' + err.message;
                    errorDiv.style.display = 'block';
                    errorDiv.style.color = 'red';
                } finally {
                    removeLoading(loadingDiv);
                    recordButton.disabled = false;
                    stream.getTracks().forEach(track => track.stop()); // Stop the microphone stream
                }
            };

            mediaRecorder.start();
            recordButton.classList.add('recording');
            recordButton.innerHTML = 'Stop Recording'; // Change button text to indicate recording
        } catch (err) {
            errorDiv.textContent = 'Failed to access microphone: ' + err.message;
            errorDiv.style.display = 'block';
            errorDiv.style.color = 'red';
            recordButton.disabled = false;
        }
    }
});

// Handle text input
sendButton.addEventListener('click', async () => {
    const text = textInput.value.trim();
    if (!text) return;

    addMessage(text, true, selectedCharacter);
    textInput.value = '';
    errorDiv.style.display = 'none';
    const loadingDiv = await showLoading();

    try {
        const response = await fetch('/process_text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text, 
                character: selectedCharacter,
                language: languageSelect.value 
            })
        });

        const data = await response.json();

        if (response.ok) {
            addMessage(data.response, false, data.character, data.synthesized_audio_url);
        } else {
            errorDiv.textContent = data.error || 'An error occurred while processing the text.';
            errorDiv.style.display = 'block';
            errorDiv.style.color = 'red';
        }
    } catch (err) {
        errorDiv.textContent = 'An error occurred: ' + err.message;
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'red';
    } finally {
        removeLoading(loadingDiv);
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
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
});

// Clear chat functionality
clearChatButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/clear_chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ip_address: ipAddress })
        });

        const data = await response.json();

        if (response.ok) {
            chatMessages.innerHTML = ''; // Clear the UI
            errorDiv.textContent = 'Chat cleared successfully!';
            errorDiv.style.display = 'block';
            errorDiv.style.color = 'green';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        } else {
            errorDiv.textContent = data.error || 'Failed to clear chat.';
            errorDiv.style.display = 'block';
            errorDiv.style.color = 'red';
        }
    } catch (err) {
        errorDiv.textContent = 'An error occurred: ' + err.message;
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'red';
    }
});

// Detect reload intent
window.addEventListener('beforeunload', (event) => {
    if (event.currentTarget.performance.navigation.type === 1) {
        isReloading = true;
    }
});

// Cleanup only on tab close, not reload
window.addEventListener('unload', () => {
    if (!isReloading) {
        const data = JSON.stringify({ ip_address: ipAddress });
        const blob = new Blob([data], { type: 'application/json' });
        navigator.sendBeacon('/cleanup', blob);
        console.log('Tab closed, cleanup signal sent');
    } else {
        console.log('Page reloaded, no cleanup');
    }
});

// Reset reload flag after load
window.addEventListener('load', () => {
    isReloading = false;
    syncConversation(initialConversation); // Load initial conversation on page load
});
