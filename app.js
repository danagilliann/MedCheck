var http = require('http'),
    express = require('express'),
    app = express(),
    moment = require('moment'),
    expressSession = require('express-session'),
    bodyParser = require('body-parser')
    path = require('path');

var mongoose = require('mongoose'),
    models = require('./models');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('dist'));


var MongoStore = require('connect-mongo')(expressSession);

app.use(expressSession({
  secret: 'asdfjoiw4ig24phummmgpijiha',
  store: new MongoStore({db: 'sess'})
}));
app.use(bodyParser());

var adminRoutes = require('./routes/admin')(app, models),
    chartRoutes = require('./routes/charts')(app, models);

app.get('/', checkDoctor, function(req, res) {
  models.Patient.find({doctorId: req.session.doctor_id}, function(err, patients) {
    res.render('dashboard.ejs', {patients: patients, doctor: req.doctor});
  })
})

app.get('/doctors', function(req, res) { 
  models.Doctor.find(function(err, doctors) { 
    if (err) {
      res.send(err);
    } else {
      res.render('doctors.ejs', {doctors: doctors});
    }
  });
});

app.post('/doctor/login', function(req, res) {
  var idt = req.body.id;
  models.Doctor.find({_id: idt}, function(err, doctor) {
    if (!err && doctor) {
      req.session.doctor_id = idt;
      req.session.save(function(err) {
        res.send(":)");
      });
    } else {
      res.send(err);
    }
  })
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
  if (!req.session.doctor_id) {
    res.status(503);
    res.send('no doctor ('+JSON.stringify(req.session)+')');
  }

  models.Doctor.findOne({_id: req.session.doctor_id}, function(err, doctor) {
    if (!err) {
      req.doctor = doctor;
      return next();
    } else {
      res.status(503);
      res.send(":(");
    }
  })
}

app.get('/dashboard/:patient_id/doctor_feedback/new', checkDoctor, function(req, res) {
  res.sendFile(path.join(__dirname + '/views/new_doctor_feedback.html'));
});

app.get('/dashboard', checkDoctor, function(req, res) {
  models.Patient.find({doctorId: req.session.doctor_id}, function(err, patients) {
    res.render('dashboard.ejs', {patients: patients, doctor: req.doctor});
  })
})

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

app.get('/dashboard/:patient_id',checkDoctor, function(req, res) { 
  models.Patient.findOne(
      {_id: req.params.patient_id},
      function(err, patient_data) { 
    if (err) {
      res.send(err);
    } else {
      res.render('view_dashboard.ejs', {patient: patient_data});
    }
  });
});

app.get('/patients/new', function(req, res) {
  models.Doctor.find(function(err, doctors) {
    res.render('new_patient.ejs', {doctors: doctors});
  })
});
app.post('/patients/new', function(req, res) {
  var patient = new models.Patient({doctorId: req.body.doctorId, name: req.body.name, email: req.body.email, accessCode: req.body.accessCode});
  patient.save(function(err, data) {
    res.send(err ? ':(' : ':)');
  });
})

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
      var day = moment(req.body[i]['time']).millisecond(0).second(0).minute(0).hour(0);
      if (!(day in to_add)) {
        to_add[day] = {}
      }
      patient[type] = req.body[i]['val'];
    }
    patient.save(function(err, data) {
      console.log([err, data]);
      res.send('ok');
    });
  });
});

app.get('/weekview/:patient_id',checkDoctor, function(req, res) { 
  models.Patient.findOne(
      {_id: req.params.patient_id},
      function(err, patient_data) { 
    if (err) {
      res.send(err);
    } else {
      res.render('weekview.ejs', {patient: patient_data});
    }
  });
});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

