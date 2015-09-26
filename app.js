var express = require('express'),
		app = express(),
		path = require('path');

app.use(express.static('public'));
app.use(express.static('dist'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

