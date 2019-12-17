const knexConfig = require('../knexfile.js')
const { stage } = require('../config')

const Pool = require('pg').Pool
const pool = new Pool(stage.db)
const knex = require('knex')(knexConfig)

module.exports = {
  stage,
  pool,
  knex,
}
