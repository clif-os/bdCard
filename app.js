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

var server = app.listen(app.get('port'), () => {
    var port = server.address().port;
    console.log('server listening on port ', port)
});

