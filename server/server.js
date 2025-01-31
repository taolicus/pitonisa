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
    // console.log('Received message:', message.toString());
    if(message.toString() === 'get_log') {
      // console.log('log requested')
      getLog(ws);
    }
    if(message.toString() === 'get_words') {
      // console.log('words requested')
      const words = cast();
      writeToLog(words);
      // console.log(words);
      // ws.send(JSON.stringify({
      //   request: 'words',
      //   words
      // }));
      getLog(ws);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

function getLog(ws) {
  let log = false;
  try {
    log = fs.readFileSync('./log.txt', 'utf8').toString();
  } catch(e) {
    let errorMessage;
    if (e instanceof Error && e.code === 'ENOENT') {
      errorMessage = 'Log file not found';
    } else {
      errorMessage = 'Unexpected error occurred while reading log';
    }
    console.log(errorMessage, e);
    ws.send(JSON.stringify({
      request: 'log',
      error: errorMessage
    }));
    return;
  }
  if(log) {
    ws.send(JSON.stringify({
      request: 'log',
      log
    }));
  }
}

function writeToLog(text) {
  try {
    fs.appendFileSync('./log.txt', `${text}\n`);
  } catch(e) {
    if (e instanceof Error && e.code === 'ENOENT') {
      console.log('Log file not found:', e.message);
    } else if (e instanceof WebSocket.Error) {
      console.log('WebSocket error:', e.message);
    } else {
      console.log('Unexpected error:', e);
    }
  }
}

function getTimestamp() {
  const options = {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'GMT',
    hour12: false
  };

  const formatter = new Intl.DateTimeFormat('en-GB', options);
  const parts = formatter.formatToParts(Date.now());

  const formattedDate = `${parts[0].value} ${parts[2].value}/${parts[4].value}/${parts[6].value} ${parts[8].value}:${parts[10].value}:${parts[12].value} GMT`;

  return formattedDate;
}

function capitalize(str) {
  return str
    .split(' ')
    .map(function(word) {
        return word[0].toUpperCase() + word.substr(1);
    })
    .join(' ');
}

function cast() {
  const cast = `${getTimestamp()} | ${capitalize(diceware(2))}`;
  return cast;
}
