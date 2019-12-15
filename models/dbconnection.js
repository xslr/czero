const { knexConfig, stage } = require('../knexfile.js')

const Pool = require('pg').Pool
const pool = new Pool(stage.db)
const knex = require('knex')(knexConfig)


module.exports = {
  stage,
  pool,
  knex,
}
