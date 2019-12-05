function getUsers(req, rsp) {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    rsp.status(200).json(results.rows)
  })
}

module.exports = {
  getUsers,
}
