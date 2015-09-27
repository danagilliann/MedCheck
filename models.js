var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var doctorFeedbackSchema = new mongoose.Schema({
  date: Date,
  feedback: Schema.Types.Mixed,
  improvement: Schema.Types.Mixed,
  patientId: mongoose.Schema.ObjectId,
  doctorId: mongoose.Schema.ObjectId,
  patientName: String,
  doctorName: String
});

var DoctorFeedback = mongoose.model('DoctorFeedback', doctorFeedbackSchema);
module.exports.DoctorFeedback = DoctorFeedback; 

var patientDataSchema = new mongoose.Schema({ 
  name: String,
  patientId: mongoose.Schema.ObjectId,
  sleep: ["Mixed"],
  heartbeat: ["Mixed"],
  exercise: ["Mixed"]
});

var PatientData = mongoose.model('PatientData', patientDataSchema);
module.exports.PatientData = PatientData;

var patientSchema = new mongoose.Schema({ 
  name: String,
  email: String,
  height: Number,
  weight: Number,
  patientId: mongoose.Schema.ObjectId,
  password: String
});

var Patient = mongoose.model('Patient', patientSchema);
module.exports.Patient = Patient;

var doctorSchema = new mongoose.Schema({ 
  name: String,
  doctorId: mongoose.Schema.ObjectId,
  password: String
});

var Doctor = mongoose.model('Doctor', doctorSchema);
module.exports.Doctor = Doctor;

mongoose.connect('mongodb://localhost/test');
