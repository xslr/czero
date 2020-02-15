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
      status: Constants.enumAsString(Constants.PaymentStatus, payment.status),
    }).returning('id')
    .catch(err => {
      console.error(`Error while inserting: ${err}`)
      throw err
    })
}


function paymentSuccess(txnId, externId) {
  return knex('tblPayment')
    .where({id: txnId})
    .update({ status: 'PAID',
              ext_transaction_id: externId,
              confirmed_at: knex.fn.now()}, ['id', 'uid', 'cid'])
    .catch(err => {
      console.log(JSON.stringify(err))
    })
}


function paymentCancel(txnId) {
  return knex('tblPayment')
    .where({id: txnId})
    .update({ status: 'CANCELLED',
              confirmed_at: knex.fn.now()}, ['id', 'uid', 'cid'])
    .catch(err => {
      console.log(JSON.stringify(err))
    })
}

module.exports = {
  newPayment,
  paymentSuccess
}
