// this is used by sequelize-cli to run seeder script - 
// not used by the app logic
require("dotenv").config();

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_URL,
    "dialect": "postgres",
    "dialectOptions": {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}