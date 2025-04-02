const { sequelize } = require('../config');
const User = require('./user');
const Patient = require('./patient');
const Doctor = require('./doctor');
const Caretaker = require('./caretaker');
const HealthRecord = require('./healthRecord');
const Medication = require('./medication');
const Appointment = require('./appointment');

// Define additional relationships
User.hasOne(Patient, { foreignKey: 'userId', as: 'patientProfile' });
User.hasOne(Doctor, { foreignKey: 'userId', as: 'doctorProfile' });
User.hasOne(Caretaker, { foreignKey: 'userId', as: 'caretakerProfile' });

Patient.hasMany(HealthRecord, { foreignKey: 'patientId', as: 'healthRecords' });
Patient.hasMany(Medication, { foreignKey: 'patientId', as: 'medications' });
Patient.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });

Doctor.hasMany(HealthRecord, { foreignKey: 'doctorId', as: 'createdRecords' });
Doctor.hasMany(Medication, { foreignKey: 'prescribedBy', as: 'prescribedMedications' });
Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'appointments' });

// Patient-Doctor many-to-many relationship for primary care
const PatientDoctor = sequelize.define('PatientDoctor', {}, { timestamps: true });
Patient.belongsToMany(Doctor, { through: PatientDoctor, as: 'doctors' });
Doctor.belongsToMany(Patient, { through: PatientDoctor, as: 'patients' });

// Patient-Caretaker many-to-many relationship
const PatientCaretaker = sequelize.define('PatientCaretaker', {
  relationship: {
    type: sequelize.Sequelize.STRING,
    allowNull: false
  },
  permissions: {
    type: sequelize.Sequelize.ARRAY(sequelize.Sequelize.STRING),
    defaultValue: ['view_basic_info']  // Default minimal permissions
  }
}, { timestamps: true });

Patient.belongsToMany(Caretaker, { through: PatientCaretaker, as: 'caretakers' });
Caretaker.belongsToMany(Patient, { through: PatientCaretaker, as: 'patients' });

// Sync models with database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully');
    return true;
  } catch (error) {
    console.error('Error synchronizing database models:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  User,
  Patient,
  Doctor,
  Caretaker,
  HealthRecord,
  Medication,
  Appointment,
  PatientDoctor,
  PatientCaretaker,
  syncDatabase
};