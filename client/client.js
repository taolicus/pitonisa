console.log('client loaded');
const logDisplay = document.getElementById('log');
const wordsDisplay = document.getElementById('words');
const getWordsBtn = document.getElementById('get_words');

let ws;
let reconnectInterval = 1000; // Initial reconnection delay in ms

function connect() {
  const host = window.location.hostname;
  const prod = host !== 'localhost';
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const socket = prod ? '/pitonisa_ws' : ':3000';
  const socket_url = `${protocol}//${host}${socket}`;
  console.log('Connecting to:', socket_url);
  ws = new WebSocket(socket_url);

  if(ws) {
    ws.onopen = () => {
      console.log('Connected to the server');
      reconnectInterval = 1000; // Reset the reconnection interval after successful connection
      // ws.send('get_log');
    }

    ws.onmessage = (event) => {
      // console.log('Received:', event.data);
      const data = JSON.parse(event.data);
      if(data.request === 'log') logDisplay.innerHTML = data.log;
      if(data.request === 'words') wordsDisplay.innerHTML = data.words;
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed. Attempting to reconnect...');
      setTimeout(connect, reconnectInterval);
      reconnectInterval = Math.min(reconnectInterval * 2, 30000); // Exponential backoff, max 30 seconds
    }

    ws.onerror = (error) => {
      console.error(`WebSocket error: ${error.message}`);
      ws.close(); // Close the connection on error to trigger reconnection
    }
  }
}

connect();

getWordsBtn.addEventListener('click', () => { ws.send('get_words') });