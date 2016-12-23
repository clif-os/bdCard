var express = require('express');

var app = express();

app.set('port', 80);

app.use('/', express.static('src'));

var server = app.listen(app.get('port'), () => {
    var port = server.address().port;
    console.log('server listening on port ', port)
})