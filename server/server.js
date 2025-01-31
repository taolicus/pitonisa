const Koa = require('koa');
const WebSocket = require('ws');
const diceware = require('diceware');
const fs = require('node:fs');

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Pitonisa Server';
});

const server = app.listen(3000, () => {
  console.log('Pitonisa listening on port 3000')
});

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    console.log('Received message:', message.toString());
    if(message.toString() === 'get_log') {
      console.log('log requested')
      let log
      try {
        log = fs.readFileSync('./log.txt', 'utf8').toString();
        // console.log(log.toString());
        ws.send(JSON.stringify({
          request: 'log',
          log
        }));
      } catch(e) {
        console.log('Error:', e);
      }
    }
    if(message.toString() === 'get_words') {
      console.log('words requested')
      const words = capitalize(diceware(2));
      ws.send(JSON.stringify({
        request: 'words',
        words
      }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

function capitalize(str) {
  return str
    .split(' ')
    .map(function(word) {
        return word[0].toUpperCase() + word.substr(1);
    })
    .join(' ');
}

function getTimestamp() {
  const now = Date();
  return ''
}