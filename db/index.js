/* eslint-disable max-len */
/* eslint-disable no-console */
const Sequelize = require("sequelize");

const db = {};

// local
console.log(process.env.DB_NAME, process.env.DB_USERNAME);
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  }
);

sequelize
  .authenticate()
  .then(con => {
    console.log("Connection has been established successfully.", con);
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

db.sequelize = sequelize;
db.Sequelize = sequelize;

module.exports = db;