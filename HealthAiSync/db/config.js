const { Sequelize } = require('sequelize');

// Initialize Sequelize with the DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: false,
      rejectUnauthorized: false
    }
  },
  logging: false, // Set to console.log to see SQL queries
});

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
};