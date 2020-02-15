const { knex } = require('./dbconnection')
const { ResultCode } = require('../result_code')


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

  return (1 === user.length) ? user[0]
                             : null
}


async function getUserByEmail(email) {
  let user = await knex('tblUser')
    .join('tblEmailLogin', 'tblUser.id', 'tblEmailLogin.userId')
    .select(userInfoColumns)
    // TODO make a view for userInfo instead of explicitly specifying the columns
    .where('email', email)

  return (1 === user.length) ? user[0]
                             : null
}


async function updateUser(userUpdate) {
  if (!userUpdate.email) {
    throw Error('user update object must have an email')
  }

  return getUserByEmail(userUpdate.email)
    .then(user => {
      // if request handling reaches here, the email was validated on the way and belongs to a user record
      // it's almost impossible that the email is does not belong to a user account, but should be checked to be safe
      if (null == user) {
        console.log(userUpdate.email)
        return { status: false, detail: ResultCode.ERR_UNKNOWN_USER_EMAIL }
      }
      Object.assign(user, userUpdate)

      // remove fields that are not to be updated
      const userId = user.id
      // const email = user.email
      delete user.id
      delete user.email

      return knex('tblUser')
        .where({ id: userId })
        .update(user)
        .then(res => {
          return { status: true, detail: user }
        })
        .catch(err => {
          console.error(`An error occured ${err}`)
          throw err
        })
    })
    .catch(err => {
      console.error(`Another error occured ${err}`)
    })
}


async function isUserOperator(uid) {
  if (!uid) {
    return false
  }

  return knex('tblOperator')
    .join('tblEmailLogin', 'tblUser.id', 'tblEmailLogin.userId')
    .select(userInfoColumns)
    // TODO make a view for userInfo instead of explicitly specifying the columns
    .where('email', email)

}


module.exports = {
  getUserById,
  getUserByEmail,
  updateUser,
}
