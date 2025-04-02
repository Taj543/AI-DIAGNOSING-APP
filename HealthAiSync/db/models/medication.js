const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');
const Patient = require('./patient');
const Doctor = require('./doctor');

const Medication = sequelize.define('Medication', {
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
  prescribedBy: {
    type: DataTypes.UUID,
    allowNull: true, // Can be null if self-reported
    references: {
      model: Doctor,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genericName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dosage: {
    type: DataTypes.STRING, // e.g., "10mg"
    allowNull: false
  },
  form: {
    type: DataTypes.STRING, // e.g., "tablet", "capsule", "liquid"
    allowNull: true
  },
  frequency: {
    type: DataTypes.STRING, // e.g., "twice daily"
    allowNull: false
  },
  timeSchedule: {
    type: DataTypes.ARRAY(DataTypes.TIME), // Specific times to take medication
    allowNull: true
  },
  withFood: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true // Ongoing medications won't have an end date
  },
  refills: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  refillsRemaining: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sideEffects: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  reactions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'discontinued', 'on_hold'),
    defaultValue: 'active'
  },
  medication_image: {
    type: DataTypes.STRING, // URL to medication image
    allowNull: true
  },
  adherence_rate: {
    type: DataTypes.FLOAT, // 0-1 representing medication adherence
    defaultValue: 1.0
  },
  aiReminderEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  paranoid: true
});

// Establish relationships
Medication.belongsTo(Patient, { foreignKey: 'patientId' });
Medication.belongsTo(Doctor, { foreignKey: 'prescribedBy', as: 'prescriber' });

module.exports = Medication;