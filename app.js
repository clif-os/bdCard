var express = require('express');
var app = express();

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

var server = app.listen(app.get('port'), () => {
  var port = server
    .address()
    .port;
  console.log('server listening on port ', port)
});
