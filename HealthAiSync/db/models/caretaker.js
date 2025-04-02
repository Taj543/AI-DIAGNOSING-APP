const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');
const User = require('./user');

const Caretaker = sequelize.define('Caretaker', {
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
  relationship: {
    type: DataTypes.STRING, // e.g., 'family', 'professional', 'friend'
    allowNull: false
  },
  isCertified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  certifications: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ name, issuingOrganization, year }]
    defaultValue: []
  },
  experience: {
    type: DataTypes.INTEGER, // years of experience
    allowNull: true
  },
  specialties: {
    type: DataTypes.ARRAY(DataTypes.STRING), // e.g., ['eldercare', 'pediatric', 'disability']
    defaultValue: []
  },
  verificationStatus: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending'
  },
  verificationDocuments: {
    type: DataTypes.ARRAY(DataTypes.STRING), // URLs to verification documents
    defaultValue: []
  },
  availabilitySchedule: {
    type: DataTypes.JSON, // Complex schedule object
    defaultValue: {}
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  paranoid: true
});

// Establish relationship
Caretaker.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Caretaker;