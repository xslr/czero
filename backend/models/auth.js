const { knex } = require('./dbconnection')
const { ResultCode } = require('../result_code')
const { resolveInclude } = require('ejs')


async function isUserOperator(uid) {
  if (!uid) {
    return false
  }

  let res = await knex('operators')
    .count({match_count: 'user_id'})
    .where('user_id', uid)

  // console.log(res)

  if (res.length > 0) {
    return res[0].match_count > 0
  } else {
    return false
  }
}


module.exports = {
  isUserOperator
}
