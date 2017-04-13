var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var app = express();
var json = require('./src/data/jchs-boston.json');

app.use(compression());
app.use(bodyParser.json({limit: '10mb'}));
app.set('port', process.env.PORT || 3000);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.send(200);
  } else {
    //move on
    next();
  }
});

app.use('/', express.static('src'));

app.get('/json', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.json(json);
})

app.get('/json-dl', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  var file = __dirname + '/src/data/jchs-boston.json'
  res.download(file);
});

const fs = require('fs')
let js;
app.post('/json-dl-filtered', (req, res) => {
  const json = JSON.stringify(req.body);
  js = json
  const buf = Buffer.from(json);
  res.writeHead(200, {
    'Content-Type': 'application/octet-stream',
    'Content-disposition': 'attachment; filename="data.json"'
  })
  res.write(buf);
  res.end();
});


app.get('/csv-dl', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  var file = __dirname + '/src/data/jchs-boston.csv'
  res.download(file);
});

var server = app.listen(app.get('port'), () => {
  var port = server
    .address()
    .port;
  console.log('server listening on port ', port)
});
// res.setHeader('Content-disposition', 'attachment; filename= jchs-bma.json');
// res.setHeader('Content-type', 'application/json');