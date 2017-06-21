const express = require('express');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use('/', express.static('src'));
app.use('/static', express.static('static'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercepts OPTIONS method
  if (req.method === 'OPTIONS') {
    // respond with 200
    res.send(200);
  } else {
    // move on
    next();
  }
});

const server = app.listen(app.get('port'), () => {
  const port = server
    .address()
    .port;
  console.log('server listening on port ', port);
});
