const { knex } = require('../models/dbconnection')
const UserModel = require('./users')
const { ConferenceStatus, ConferenceRole, ModelResult, enumAsString }  = require('../constants')


function isValidRole(role) {
  return Object.values(ConferenceRole).includes(role)
}


function isExclusiveRole(role) {
  return role === ConferenceRole.program_chair;
}


async function create(conf) {
  return knex('conferences')
    .insert(conf)
}


async function assignRoleByUserId(cid, uid, role) {
  if (undefined == cid || null == cid) {
    return { result: ModelResult.INVALID_PARAM, error_detail: `conference id null` }
  }
  if (undefined == uid || null == uid) {
    return { result: ModelResult.INVALID_PARAM, error_detail: `user id null` }
  }
  if (!isValidRole(role)) {
    return { result: ModelResult.INVALID_PARAM, error_detail: `invalid conference role ${role}` }
  }

  return knex('conference_member')
    .insert({
      user_id: uid,
      conferenceId: cid,
      role: enumAsString(ConferenceRole, role),
    }, ['user_id', 'conferenceId'])
    .then(res => {
      if (1 === res.length) {
        return { result: ModelResult.OK }
      } else {
        return { result: ModelResult.UNKNOWN_ERROR }
      }
    })
    .catch(err => {
      console.error(`Error adding conference role: ${JSON.stringify(err)}`)
      if (undefined === err) {
        return { result: ModelResult.UNKNOWN_ERROR }
      } else if (23505 === Number(err.code)) {
        return { result: ModelResult.NO_CHANGE_REQUIRED }
      } else {
        return { result: ModelResult.UNKNOWN_ERROR }
      }
    })
}


async function assignRoleByEmail(cid, email, role) {
  const userId = await UserModel.getUserByEmail(email)

  return await assignRoleByUserId(cid, userId, role)
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


async function addUserToProgramCommittee(cid, email) {
  const { res, error_detail } = assignRoleByEmail(cid, email, ConferenceRole.program_committee)

  return { res, error_detail }
}


async function setConferenceChair(cid, email) {
  const { res, error_detail } = assignRoleByEmail(cid, email, ConferenceRole.program_chair)

  return { res, error_detail }
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
  setConferenceChair,
  addUserToProgramCommittee,
}
