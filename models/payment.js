const { knex } = require('./dbconnection')
const UserModel = require('./users')
const Constants = require('../constants')


async function newPayment(payment) {
  const user = await UserModel.getUserByEmail(payment.email)

  return knex('tblPayment')
    .insert({
      uid: user.id,
      cid: payment.cid,
      amount: payment.amount,
      status: Constants.paymentStatusAsString(payment.status),
    }).returning('id')
    .catch(err => {
      console.error(`Error while inserting: ${err}`)
      throw err
    })
}

module.exports = {
  newPayment,
}