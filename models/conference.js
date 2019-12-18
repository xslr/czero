const { knex } = require('../models/dbconnection')
const { ResultCode } = require('../result_code')
const UserModel = require('./users')
const {ConferenceStatus}  = require('../constants')

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


async function read(cid) {}


async function readAll() {}


async function update(confUpdate) {}


async function remove(cid) {}


function getConferenceStatus(conf) {
  if (!conf)
    return ConferenceStatus.NO_CONFERENCE

  let status = ConferenceStatus.CLOSED
  const now = new Date()
  if (now < new Date(conf.dateStart)) {
    status = ConferenceStatus.OPEN
  } else if (now < new Date(conf.dateEnd)) {
    status = ConferenceStatus.ACTIVE
  }

  return status
}

async function conferenceStatusById(cid) {
  let c = await knex('tblConference').select().where('id', cid)
  if (c instanceof Array) {
    c = c[0]
  }
  const status = getConferenceStatus(c)
  return status
}


module.exports = {
  create,
  assignRole,
  read,
  readAll,
  update,
  remove,
  conferenceStatusById,
}
