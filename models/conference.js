const { knex } = require('../models/dbconnection')
const { ResultCode } = require('../result_code')
const UserModel = require('./users')

const ConferenceRoles = ['programChair', 'attendee', 'reviewer']


function isValidRole(role) {
  return ConferenceRoles.includes(role)
}


async function create(conf) {
  return knex('tblConference')
    .insert(conf)
}


async function assignRole(confId, email, role) {
  if (!isValidRole(role)) {
    return ResultCode.ERR_INVALID_ROLE
  }

  const userId = await UserModel.getUserByEmail(email)

  if (!userId) {
    return false
  }

  return knex('tblConferenceMember')
    .insert({
      userId: userId,
      conferenceId: confId,
      role: role,
    })
    .then(res => {
      return res.rowCount == 1
    })
    .catch(err => {
      return err
    })
}


async function read(confId) {}


async function readAll() {}


async function update(confUpdate) {}


async function remove(confId) {}


module.exports = {
  create,
  assignRole,
  read,
  readAll,
  update,
  remove,
}
