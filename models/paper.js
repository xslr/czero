const { knex } = require('./dbconnection')
const { ResultCode } = require('../result_code')
const { ModelResult } = require('../constants')


function onAddPaperQuerySuccess(req, rsp, result) {
  return ModelResult.CREATED
}

function onAddPaperQueryError(req, rsp, result) {}

async function addPaper(p) {
  return knex.transaction(trx => {
    return trx
      .insert({
        title: p.title,
        authors: p.authors,
        submitterId: p.uploaderId,
        presenterId: p.presenterId,
        cid: p.cid,
      }, 'id')
      .into('tblPaper')
      .then(id => {
        // console.log(`--> id is ${id}:${typeof id}:${id.toString()}`)
        return trx.insert({
          email: req.body.email,
          pwHash: hashedPassword,
          userId: id[0],
        })
        .into('tblEmailLogin')
        .catch(err => {
          console.error(`Error inserting into login table: ${err}`)
          throw err
        })
      })
      .catch(err => {
        console.error(`Error while inserting: ${err}`)
        throw err
      })
  })
  .then(result => onAddPaperQuerySuccess(req, rsp, result))
  .catch(err => onAddPaperQueryError(req, rsp, err))
}


function isPaperRevisionValid(paperRevision) {
  // TODO
  return true
}


async function getLastRevision(paperId) {
  let res = await knex('tblPaperRevision')
    .max('revisionNumber')
    .where({paperId: paperId})

  // console.log(`--> res = ${JSON.stringify(res)}`)

  var lastRev = res[0].max
  if (lastRev === null) {
    lastRev = 0
  } else {
    lastRev = Number(res[0].max)
  }

  // console.log(`--> lastRev = ${lastRev}`)

  return lastRev
}


async function addRevision(paperRevision) {
  if (!isPaperRevisionValid(paperRevision)) {
    return ModelResult.INVALID_PARAM
  }

  // console.log(`rev=${JSON.stringify(paperRevision)}`)

  let nextRevision = -1
  try {
    nextRevision = 1 + await getLastRevision(paperRevision.paperId)
  } catch (error) {
    console.error(`Error trying to get next revision: ${JSON.stringify(error)}`)
    return ModelResult.NOT_FOUND
  }

  return knex('tblPaperRevision')
    .insert({
      revisionNumber: nextRevision,
      abstract: paperRevision.abstract,
      paperId: paperRevision.paperId,
    }, 'revisionNumber')
    .into('tblPaperRevision')
    .then(revisionNumber => {
      console.log(`Added revision number ${revisionNumber}`)
      return { result: ModelResult.CREATED, revNum: revisionNumber }
    })
}


async function setRevisionDocument(paperId, revNum, name, type, blob) {
  if (name.length < 1 || blob.length < 1) {
    return ModelResult.INVALID_PARAM
  }

  let res = await knex.transaction(async trx => {
    let uploadedIds = await trx.insert({
      name: name,
      mime_type: type,
      object: blob,
    }, 'id')
    .into('tblBinaries')

    if (1 != uploadedIds.length) {
      // console.log('--> 1')
      return ModelResult.UNKNOWN_ERROR
    }

    newUploadId = Number(uploadedIds[0])
    let updates = await trx('tblPaperRevision')
      .where({paperId: paperId, revisionNumber: revNum})
      .update({uploadId: newUploadId}, 'revisionNumber')

    if (1 === updates.length) {
      // console.log('--> 2')
      return ModelResult.ALTERED
    } else if (0 === updates.length) {
      return ModelResult.NOT_FOUND
    } else {
      console.log(`--> 3 updates=${JSON.stringify(updates)} updates.length=${updates.length}`)
      return ModelResult.UNKNOWN_ERROR
    }
  })

  return res
}


async function getPaper(paperId) {
}


async function getUserPapers(uid) {
}


async function getAllPapers() {
}


module.exports = {
  addPaper,
  addRevision,
  getPaper,
  getUserPapers,
  getAllPapers,
  setRevisionDocument,
}
