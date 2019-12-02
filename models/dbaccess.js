const Pool = require('pg').Pool
const pool = new Pool({
  host: 'localhost',
  user: 'capn_noodles',
  password: 'capn_noodles',
  database: 'noodles',
  port: 5432,
})

const getUsers = (req, rsp) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    rsp.status(200).json(results.rows)
  })
}

module.exports = {
    getUsers
}
