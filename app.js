var http = require('http'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser')
    path = require('path');

var mongoose = require('mongoose'),
    models = require('./models');

app.use(express.static('public'));
app.use(express.static('dist'));
app.use(bodyParser());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/doctors', function(req, res) { 
  models.Doctor.find(function(err, doctors) { 
    if (err) {
      res.send(err);
    } else {
      res.json(doctors);
    }
  });
});

app.post('/data', function(req, res) {
  console.log(req.body);
  res.send('["ok", true]')
})

app.get('/doctors/new', function(res, res) {
  res.sendFile(path.join(__dirname + '/views/new_doctor.html'));
})
app.post('/doctors/new', function(req, res) {
  var newDoctor = new models.Doctor(
    {name: req.body.name, password: req.body.password}
  );
  newDoctor.save(function(err) {
    res.send(err == null ? 'success :) ' : 'error');
  })
})

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

