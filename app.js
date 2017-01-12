var express = require('express');

var app = express();

app.set('port', process.env.PORT || 8080);

app.use('/', express.static('src'));

var server = app.listen(app.get('port'), () => {
    var port = server.address().port;
    console.log('server listening on port ', port)
})