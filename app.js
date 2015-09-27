var http = require('http'),
    express = require('express'),
    app = express(),
    expressSession = require('express-session'),
    bodyParser = require('body-parser')
    path = require('path');

var mongoose = require('mongoose'),
    models = require('./models');


app.use(express.static('public'));
app.use(express.static('dist'));

app.use(expressSession({secret: 'asdfjoiw4ig24phummmgpijiha'}));
app.use(bodyParser());

var adminRoutes = require('./routes/admin')(app, models),
    chartRoutes = require('./routes/charts')(app, models);

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
});

app.get('/doctors/new', function(res, res) {
  res.sendFile(path.join(__dirname + '/views/new_doctor.html'));
});

app.post('/doctors/new', function(req, res) {
  var newDoctor = new models.Doctor(
    {name: req.body.name, password: req.body.password}
  );
  newDoctor.save(function(err) {
    res.send(err == null ? 'success :) ' : 'error');
  });
});

function checkDoctor(req, res, next) {
  if (!req.session.doctor_id) return res.status(503);

  models.Doctor.find(req.session.doctor_id, function(err, doctor) {
    if (!err) {
      req.doctor = doctor;
      return next();
    } else {
      return res.status(503);
    }
  })
}

app.get('/dashboard/:patient_id/doctor_feedback/new', checkDoctor, function(req, res) {
  res.sendFile(path.join(__dirname + '/views/new_doctor_feedback.html'));
});

function getDashboardFinders(req, merge, is_full) {
  var skinny = {doctorId: req.doctor._id, patientId: req.patient._id};
  if (!merge) merge = {};
  if (is_full) {
    skinny['doctorName'] = req.doctor.name;
    skinny['patientName'] = req.patient.name;
  }
  return Object.assign(skinny, merge);
}

app.get('/dashboard/:patient_id/doctor_feedback', checkDoctor, function(req, res) { 
  models.DoctorFeedback.find(getDashboardFinders(req), function(err, doctor_feedback) { 
    if (err) {
      res.send(err);
    } else {
      res.json(doctor_feedback);
    }
  });
});

app.post('/dashboard/:patient_id/doctor_feedback/new', checkDoctor, function(req, res) {
  var newDoctorFeedback = new models.DoctorFeedback(
		getDashboardFinders(req, {feedback: req.body.feedback, date: req.body.date, improvement: req.body.improvement }, true)
  );
  newDoctorFeedback.save(function(err) {
    res.send(err == null ? 'successly ' : 'error');
  });
});

app.get('/dashboard/:patient_id/patient_data', checkDoctor, function(req, res) { 
  models.PatientData.find(
      {doctorId: req.doctor._id, patientId: req.params.patient_id},
      function(err, patient_data) { 
    if (err) {
      res.send(err);
    } else {
      res.json(patient_data);
    }
  });
});

app.post('/sync_patient_data', function(req, res) {
  var allowed_types = ['energy', 'heartbeat', 'exercise', 'distance'];
  if (allowed_types.indexOf(req.body.type) == -1) {
    res.error(405);
    return false;
  }
  var type = req.body.type;

  models.Patient.find({accessCode: req.body.accessCode}, function(err, patient) {
    to_add = {};
    for (var i = 0; i < req.body.length; i++) {
      patient[type][req.body[i]['time']] = req.body[i]['val'];
    }
    patient.save(function(err, data) {
      console.log([err, data]);
      res.send('ok');
    });
  });
});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

