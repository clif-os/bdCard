var express = require('express');
var compression = require('compression');
var app = express();
var json = require('./src/data/jchs-boston.json');

app.use(compression());
app.set('port', process.env.PORT || 3000);

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

app.get('/csv-dl', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  var file = __dirname + '/src/data/jchs-boston.csv'
  res.download(file);
});

var server = app.listen(app.get('port'), () => {
    var port = server.address().port;
    console.log('server listening on port ', port)
});
// res.setHeader('Content-disposition', 'attachment; filename= jchs-bma.json');
// res.setHeader('Content-type', 'application/json');