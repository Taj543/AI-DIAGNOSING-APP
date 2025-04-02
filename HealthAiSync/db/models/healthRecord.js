const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');
const Patient = require('./patient');
const Doctor = require('./doctor');

const HealthRecord = sequelize.define('HealthRecord', {
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
    allowNull: true, // Can be null if added by patient or system
    references: {
      model: Doctor,
      key: 'id'
    }
  },
  recordType: {
    type: DataTypes.ENUM(
      'vital_signs', 
      'lab_result', 
      'diagnostic_image', 
      'doctor_note', 
      'prescription', 
      'procedure', 
      'allergy', 
      'vaccination', 
      'symptom_report',
      'ai_analysis'
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dateRecorded: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  data: {
    type: DataTypes.JSON, // Flexible structure based on recordType
    allowNull: false
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING), // URLs to attachments
    defaultValue: []
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  category: {
    type: DataTypes.STRING, // For categorization and filtering
    allowNull: true
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  aiGenerated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  aiConfidenceScore: {
    type: DataTypes.FLOAT, // 0-1 for AI-generated insights
    allowNull: true
  }
}, {
  timestamps: true,
  paranoid: true
});

// Establish relationships
HealthRecord.belongsTo(Patient, { foreignKey: 'patientId' });
HealthRecord.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

module.exports = HealthRecord;