const db = require('../config/db')
const Sequelize = require('sequelize')

const User = db.define('doctordetail', {
    // attributes
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
  });


module.exports = User;