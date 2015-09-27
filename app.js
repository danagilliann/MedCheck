var http = require('http'),
		express = require('express'),
		app = express(),
		path = require('path');

var mongoose = require('mongoose'),
		models = require('./models/schema');

var db = mongoose.connect('mongodb://localhost/myapp'),
		Doctor = mongoose.model("Doctor");

mongoose.connect('mongodb://localhost/test');

app.use(express.static('public'));
app.use(express.static('dist'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/sample', function(req, res) { 
	Doctor.find(function(err, Doctor) { 
	
		if (err) res.send(err)
		res.json(Doctor);
	});
	
	res.sendFile(path.join(__dirname + '/views/sample.html'));	

});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

