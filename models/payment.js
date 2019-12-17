const { knex } = require('./dbconnection')
const { ResultCode } = require('../result_code')
const UserModel = require('./users')
const Utils = require('../utils')
const Constants = require('../constants')


async function newPayment(payment) {
  const uid = await UserModel.getUserByEmail(payment.email)
  return knex('tblPayment')
    .insert({
      userId: uid,
      amount: payment.amount,
      status: Constants.paymentStatusAsString(payment.status),
    })
    // .then(res => {
    //   console.log(JSON.stringify(res))
    // })
    .catch(err => {
      console.error(`Error while inserting: ${err}`)
      throw err
    })
}

module.exports = {
  newPayment,
}