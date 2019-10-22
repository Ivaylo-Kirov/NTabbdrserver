const db = require('../config/db')
const Sequelize = require('sequelize')

const Doctor = db.define('doctor', {
  name: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
      type: Sequelize.STRING,
      allowNull: false
  },
  communication: {
      type: Sequelize.STRING
  }
})

// Doctor.sync()
//   .then(() => console.log('table created'))

module.exports = Doctor;