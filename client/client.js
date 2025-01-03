console.log('client loaded');
const wordsDisplay = document.getElementById('words');

let ws;
let reconnectInterval = 1000; // Initial reconnection delay in ms

function connect() {
  ws = new WebSocket('ws://localhost:3000');

  if(ws) {
    ws.onopen = () => {
      console.log('Connected to the server');
      reconnectInterval = 1000; // Reset the reconnection interval after successful connection
      ws.send('get_words');
    }

    ws.onmessage = (event) => {
      try {
        const words = JSON.parse(event.data);
        console.log(words);
        wordsDisplay.innerHTML = words;
      }
      catch {
        console.log(`Received: ${event.data}`);
      }
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