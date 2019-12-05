const environment = process.env.ENVIRONMENT || 'development'
const config = require('../knexfile.js')[environment]

const connectionParam = {
  host:     config.connection.host,
  port:     config.connection.port,
  database: config.connection.database,
  user:     config.connection.user ,
  password: config.connection.password,
}

const Pool = require('pg').Pool
const pool = new Pool(connectionParam)

const knex = require('knex')(config)

module.exports = {
  connectionParam,
  pool,
  knex,
}
