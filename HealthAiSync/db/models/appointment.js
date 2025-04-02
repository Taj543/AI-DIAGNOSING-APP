const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');
const Patient = require('./patient');
const Doctor = require('./doctor');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Patient,
      key: 'id'
    }
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Doctor,
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'cancelled', 'completed', 'no_show', 'rescheduled'),
    defaultValue: 'scheduled'
  },
  appointmentType: {
    type: DataTypes.ENUM('in_person', 'video', 'phone'),
    allowNull: false
  },
  reasonForVisit: {
    type: DataTypes.STRING,
    allowNull: true
  },
  symptoms: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  followUpNeeded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  followUpInterval: {
    type: DataTypes.INTEGER, // Days until follow-up
    allowNull: true
  },
  sentReminder: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  videoUrl: {
    type: DataTypes.STRING, // For video appointments
    allowNull: true
  },
  insuranceVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  copayAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  intakeFormCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  aiSummary: {
    type: DataTypes.TEXT, // AI-generated summary of the appointment
    allowNull: true
  }
}, {
  timestamps: true,
  paranoid: true
});

// Establish relationships
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

module.exports = Appointment;