const { knex } = require('./dbconnection')
const bcrypt = require('bcrypt');

const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];


const userInfoColumns = [
  'addressCountry', 'addressLine1', 'addressLine2', 'addressZip',
  'createdAt', 'deletedAt', 'email', 'firstName', 'id', 'lastName',
  'middleName', 'phone', 'status', 'updatedAt']

async function getUserById(id) {
  let user = await knex('tblUser')
    .join('tblEmailLogin', 'tblUser.id', 'tblEmailLogin.userId')
    .select(userInfoColumns)
    // TODO make a view for userInfo instead of explicitly specifying the columns
    .where('id', id)

  return (1 == user.length) ? user[0]
                            : null
}


async function getUserByEmail(email) {
  let user = await knex('tblUser')
    .join('tblEmailLogin', 'tblUser.id', 'tblEmailLogin.userId')
    .select(userInfoColumns)
    // TODO make a view for userInfo instead of explicitly specifying the columns
    .where('email', email)

  return (1 == user.length) ? user[0]
                            : null
}


module.exports = {
  getUserById,
  getUserByEmail,
}
