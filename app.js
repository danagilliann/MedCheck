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

app.use(expressSession({
  secret: 'asdfjoiw4ig24phummmgpijiha'
}));
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
});

app.get('/accessCode', function(req, res) {
  var code = req.params.q;
  models.Patient.findOne({accessCode: code}, function(err, patient) {
    if (patient) {
      res.json({success: true, patient: patient});
    } else {
      res.error(404);
      res.json({success: false});
    }
  })
})

app.post('/sync_patient_data', function(req, res) {
  var allowed_types = ['energy', 'heartbeat', 'exercise', 'distance'];
  if (allowed_types.indexOf(req.body.type) == -1) {
    res.error(405);
    return false;
  }
  var type = req.body.type;
  var data = req.body['data'];

  models.Patient.findOne({accessCode: req.body.accessCode}, function(err, patient) {
    console.log('has patient');
    to_add = {};
    for (var i = 0; i < data.length; i++) {
      var day = moment(data[i]['time']).millisecond(0).second(0).minute(0).hour(0);
      if (!(day in to_add)) {
        to_add[day] = {}
      }
      to_add[day][data[i]['time']] = Math.floor(data[i]['val']);
    }
    Object.keys(to_add).forEach(function(day){
      var updateData = {};
      updateData[type] = [];
      var addToDb = [];
      Object.keys(to_add[day]).forEach(function(key) {
        updateData[type].push([key, to_add[day][key]]);
      })
      models.PatientData.update({patientId: patient._id, date: new Date(day)}, updateData, {upsert: true}, function(err) {
        if (err) {
          console.log('err!', err);
        }
      });
    });
    res.end('OK');
  });
});

app.get('/graphview', function(req, res) {
  var finders = {};
  if ('day' in req.params) {
    finders['date'] = moment(req.params.day).millisecond(0).second(0).minute(0).hour(0);
  } else if ('accessCode' in req.params) {
    finders['accessCode'] = req.params.accessCode;
  }
  db.PatientData.find(finders, function(err, documents) {
    res.json(documents);
  })
})

app.get('/weekview', function (req, res) {
	res.sendFile(path.join(__dirname + '/views/weekview.html'));
});

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

