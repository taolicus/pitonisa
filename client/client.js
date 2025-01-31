console.log('client loaded');
const logDisplay = document.getElementById('log');
const wordsDisplay = document.getElementById('words');
const getWordsBtn = document.getElementById('get_words');

let ws;
let reconnectInterval = 1000; // Initial reconnection delay in ms

function connect() {
  ws = new WebSocket(`ws://${window.location.hostname}:3000`);

  if(ws) {
    ws.onopen = () => {
      console.log('Connected to the server');
      reconnectInterval = 1000; // Reset the reconnection interval after successful connection
      ws.send('get_log');
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