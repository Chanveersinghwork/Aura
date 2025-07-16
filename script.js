


// script.js

let email = "";
let recognition;

function login() {
  email = document.getElementById('email').value;
  if (email) {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('chat-container').classList.remove('hidden');
  }
}

function appendMessage(text, sender, audioUrl = null) {
  const div = document.createElement('div');
  div.className = 'message ' + (sender === 'user' ? 'user-message' : 'ai-message');
  div.innerText = text;
  if (sender === 'ai') {
    const audioBtn = document.createElement('button');
    audioBtn.innerText = '🔊';
    audioBtn.className = 'audio-btn';
    audioBtn.onclick = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    };
    div.appendChild(audioBtn);
  }
  document.getElementById('chat-box').appendChild(div);
  document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('user-input');
  const message = input.value.trim();
  if (!message) return;
  appendMessage(message, 'user');
  input.value = "";

  fetch("https://871e67eb-bcdc-4e9b-8d6c-8dcddee75e69-00-1dvwercvd6z7a.sisko.replit.dev/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_input: message, user_email: email })
  })
  .then(res => res.json())
  .then(data => {
    appendMessage(data.reply, 'ai');
  })
  .catch(err => {
    appendMessage("Error: " + err.message, 'ai');
  });
}

function startRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = function(event) {
    document.getElementById('user-input').value = event.results[0][0].transcript;
  };
}

function newChat() {
  document.getElementById('chat-box').innerHTML = '';
}
