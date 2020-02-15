const { knex } = require('../models/dbconnection')
const UserModel = require('./users')
const { ConferenceStatus, ConferenceRole, enumAsString, ResultCode }  = require('../constants')


function isValidRole(role) {
  return Object.values(ConferenceRole).includes(role)
}


async function create(conf) {
  return knex('conferences')
    .insert(conf)
}


async function assignRoleByUserId(confId, userId, role) {
  if (undefined == confId) {
    return ResultCode.ERR_INVALID_CONFERENCE
  }
  if (undefined == userId) {
    return ResultCode.ERR_UNKNOWN_USER_ID
  }
  if (!isValidRole(role)) {
    return ResultCode.ERR_INVALID_ROLE
  }

  return knex('conference_member')
    .insert({
      userId: userId,
      conferenceId: confId,
      role: enumAsString(ConferenceRole, role),
    }, ['userId', 'conferenceId'])
    .then(res => {
      if (1 === res.length) {
        return ResultCode.OK
      } else {
        return ResultCode.ERR_UNKNOWN
      }
    })
    .catch(err => {
      console.error(`Error adding conference role: ${JSON.stringify(err)}`)
      if (undefined === err) {
        return ResultCode.ERR_UNKNOWN
      } else if (23505 === Number(err.code)) {
        return ResultCode.ERR_DUPLICATE_ENTRY
      } else {
        return ResultCode.ERR_UNKNOWN
      }
    })
}


async function assignRoleByEmail(confId, email, role) {
  const userId = await UserModel.getUserByEmail(email)

  return await assignRoleByUserId(confId, userId, role)
}


async function readById(cid) {
  let c = await knex('conferences').where('id', cid)
  // console.log(`cid = ${cid}, c=${JSON.stringify(c)}`)

  if (1 === c.length)
    return c[0]
}


async function readAll() {
  let cs = await knex('conferences')
      .select(/*'id', 'name', 'date_start', 'date_end'*/)

  return cs
}


async function update(confUpdate) {}


async function remove(cid) {}


function getConferenceStatus(conf) {
  if (!conf)
    return ConferenceStatus.NO_CONFERENCE

  let status = ConferenceStatus.CLOSED
  const now = new Date()
  if (now < new Date(conf.date_start)) {
    status = ConferenceStatus.OPEN
  } else if (now < new Date(conf.date_end)) {
    status = ConferenceStatus.ACTIVE
  }

  return status
}

async function conferenceStatusById(cid) {
  let c = await knex('conferences').select().where('id', cid)
  if (c instanceof Array) {
    c = c[0]
  }
  const status = getConferenceStatus(c)
  return status
}


module.exports = {
  create,
  assignRoleByEmail,
  assignRoleByUserId,
  readById,
  readAll,
  update,
  remove,
  conferenceStatusById,
}
