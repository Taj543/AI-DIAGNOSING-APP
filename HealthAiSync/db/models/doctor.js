const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');
const User = require('./user');

const Doctor = sequelize.define('Doctor', {
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
  specialization: {
    type: DataTypes.STRING,
    allowNull: false
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  hospitalAffiliation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  education: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ institution, degree, year }]
    defaultValue: []
  },
  certifications: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ name, issuingOrganization, year }]
    defaultValue: []
  },
  yearsOfExperience: {
    type: DataTypes.INTEGER,
    allowNull: true
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
  },
  isAcceptingNewPatients: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  verificationStatus: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending'
  },
  verificationDocuments: {
    type: DataTypes.ARRAY(DataTypes.STRING), // URLs to verification documents
    defaultValue: []
  }
}, {
  timestamps: true,
  paranoid: true
});

// Establish relationship
Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Doctor;