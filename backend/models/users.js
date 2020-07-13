const { knex } = require('./dbconnection')
const { ResultCode } = require('../result_code')


const userInfoColumns = [
  'address_country', 'address_line1', 'address_line2', 'address_zip',
  'created_at', 'deleted_at', 'email', 'first_name', 'id', 'last_name',
  'middle_name', 'phone', 'status', 'updated_at']


async function getUserById(id) {
  let user = await knex('users')
    .join('email_logins', 'users.id', 'email_logins.user_id')
    .select(userInfoColumns)
    // TODO make a view for userInfo instead of explicitly specifying the columns
    .where('id', id)

  return (1 === user.length) ? user[0]
                             : null
}


async function getUserByEmail(email, dbFieldNames = false) {
  let user = await knex('users')
    .join('email_logins', 'users.id', 'email_logins.user_id')
    .select(userInfoColumns)
    // TODO make a view for userInfo instead of explicitly specifying the columns
    .where('email', email)

  return (1 === user.length) ? (dbFieldNames ? user[0] : remapFields(user[0]))
                             : null
}


const mapping = {
  firstName: 'first_name',
  lastName: 'last_name',
  addressCountry: 'address_country',
  addressLine1: 'address_line1',
  addressLine2: 'address_line2',
  addressZip: 'address_zip',
  createdAt: 'created_at',
  deletedAt: 'deleted_at',
  middleName: 'middle_name',
  phone: 'phone',
  status: 'status',
  updatedAt: 'updated_at',
};

const revMapping = Object.entries(mapping).reduce((acc, [key, val]) => {
  acc[val] = key;
  return acc;
}, {});


function mappedKey(key) {
  if (key in mapping ) {
    return mapping[key];
  } else if (key in revMapping) {
    return revMapping[key];
  }

  return key;
}


function remapFields(obj) {
  let mapped = Object.entries(obj).reduce((acc, [key, val]) => {
    acc[mappedKey(key)] = val;
    return acc;
  }, {});
  return mapped;
}


async function updateUser(userUpdate) {
  if (!userUpdate.email) {
    throw Error('user update object must have an email')
  }

  return getUserByEmail(userUpdate.email, true)
    .then(user => {
      // if request handling reaches here, the email was validated on the way and belongs to a user record
      // it's almost impossible that the email is does not belong to a user account, but should be checked to be safe
      if (null == user) {
        console.log(userUpdate.email)
        return { status: false, detail: ResultCode.ERR_UNKNOWN_USER_EMAIL }
      }
      let dbUpdate = remapFields(userUpdate);
      Object.assign(user, dbUpdate);

      // remove fields that are not to be updated
      const userId = user.id
      // const email = user.email
      delete user.id
      delete user.email

      return knex('users')
        .where({ id: userId })
        .update(user)
        .then(res => {
          return { status: true, detail: { user: remapFields(user) } }
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
    .join('email_logins', 'users.id', 'email_logins.user_id')
    .select(userInfoColumns)
    // TODO make a view for userInfo instead of explicitly specifying the columns
    .where('email', email)

}


module.exports = {
  getUserById,
  getUserByEmail,
  updateUser,
}
