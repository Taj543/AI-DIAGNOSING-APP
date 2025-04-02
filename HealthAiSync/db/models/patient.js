const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');
const User = require('./user');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  bloodType: {
    type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'),
    defaultValue: 'unknown'
  },
  height: {
    type: DataTypes.FLOAT, // in cm
    allowNull: true
  },
  weight: {
    type: DataTypes.FLOAT, // in kg
    allowNull: true
  },
  allergies: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  chronicConditions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  emergencyContact: {
    type: DataTypes.JSON, // { name, relationship, phone }
    defaultValue: {}
  },
  insuranceProvider: {
    type: DataTypes.STRING,
    allowNull: true
  },
  insuranceNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  preferredPharmacy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  primaryCareDoctor: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Doctors', // references the table name
      key: 'id'
    }
  }
}, {
  timestamps: true,
  paranoid: true
});

// Establish relationship
Patient.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Patient;