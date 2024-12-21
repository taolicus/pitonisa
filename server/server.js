const Koa = require('koa');
const WebSocket = require('ws');

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
    console.log(`Received message: ${message}`);
    ws.send(JSON.stringify(message))
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});