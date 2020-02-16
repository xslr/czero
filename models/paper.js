const { knex } = require('./dbconnection')
const { ResultCode } = require('../result_code')
const { ModelResult } = require('../constants')


async function addPaper(p) {
  return ModelResult.UNKNOWN_ERROR
}


function isPaperRevisionValid(paperRevision) {
  // TODO
  return true
}


async function getLastRevision(paperId) {
  let res = await knex('paper_revisions')
    .max('revision_number')
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

  return knex('paper_revisions')
    .insert({
      revision_number: nextRevision,
      abstract: paperRevision.abstract,
      paperId: paperRevision.paperId,
    }, 'revision_number')
    .into('paper_revisions')
    .then(revision_number => {
      console.log(`Added revision number ${revision_number}`)
      return { result: ModelResult.CREATED, revNum: revision_number }
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
    .into('binaries')

    if (1 != uploadedIds.length) {
      // console.log('--> 1')
      return ModelResult.UNKNOWN_ERROR
    }

    const newUploadId = Number(uploadedIds[0])
    let updates = await trx('paper_revisions')
      .where({paperId: paperId, revision_number: revNum})
      .update({upload_id: newUploadId}, 'revision_number')

    if (1 === updates.length) {
      // console.log('--> 2')
      return ModelResult.ALTERED
    } else if (0 === updates.length) {
      return ModelResult.NOT_FOUND
    } else {
      // console.log(`--> 3 updates=${JSON.stringify(updates)} updates.length=${updates.length}`)
      return ModelResult.UNKNOWN_ERROR
    }
  })

  return res
}


async function getPaper(paperId) {
  let paper = null
  try {
    paper = await knex('papers')
      .join('paper_revisions', 'papers.id', 'paper_revisions.paper_id')
      .join('binaries', 'paper_revisions.upload_id', 'binaries.id')
      .first([
          { id: 'papers.id' },
          { title: 'papers.title' },
          { dateOfSubmission: 'papers.date_submitted' },
          { status: 'papers.status' },
          { revNum: 'paper_revisions.revision_number' },
          { abstract: 'paper_revisions.abstract' },
          { docName:  'binaries.name' },
          { docKey: 'paper_revisions.upload_id' },  // TODO: implement a randomized upload key instead of exposing the document id
          ])
      .where('papers.id', paperId)
      .orderBy('paper_revisions.revision_number', 'desc')
  } catch (e) {
    return ModelResult.UNKNOWN_ERROR
  }

  // console.log(paper)

  if (null === paper) {
    return { result: ModelResult.NOT_FOUND, paper: null }
  } else {
    return { result: ModelResult.FOUND, paper: paper }
  }
}


async function getPaperRevision(paperId, revNum) {
  let paper = null
  try {
    paper = await knex('papers')
      .join('paper_revisions', 'papers.id', 'paper_revisions.paper_id')
      .join('binaries', 'paper_revisions.upload_id', 'binaries.id')
      .first([
          { id: 'papers.id' },
          { title: 'papers.title' },
          { dateOfSubmission: 'papers.date_submitted' },
          { status: 'papers.status' },
          { revNum: 'paper_revisions.revision_number' },
          { abstract: 'paper_revisions.abstract' },
          { docName:  'binaries.name' },
          { docKey: 'paper_revisions.upload_id' },  // TODO: implement a randomized upload key instead of exposing the document id
          ])
      .where({
          'papers.id': paperId,
          'paper_revisions.revision_number': revNum,
        })
  } catch (e) {
    return ModelResult.UNKNOWN_ERROR
  }

  // console.log(paper)

  if (null === paper) {
    return { result: ModelResult.NOT_FOUND, paper: null }
  } else {
    return { result: ModelResult.FOUND, paper: paper }
  }
}


async function getPaperBlob(uploadKey) {
  let paper = null
  try {
    paper = await knex('binaries')
      .first([
          { uploadKey: 'binaries.id' },
          { docName: 'binaries.name' },
          { mimeType: 'binaries.mime_type' },
          { blob: 'binaries.object' },
          ])
      // TODO: Implement a randomized upload key instead of exposing the document id
      //       The upload key should combine upload id and a randomised key to prevent key guessing.
      .where('binaries.id', uploadKey)
  } catch (e) {
    return ModelResult.UNKNOWN_ERROR
  }

  // console.log(paper)

  if (null === paper) {
    return { result: ModelResult.NOT_FOUND, paper: null }
  } else {
    return { result: ModelResult.FOUND, paper: paper }
  }
}


async function getUserPapers(uid) {
  let rows = null
  try {
    rows = await knex('papers')
      .where('submitter_id', uid)
      .select(['id', 'title', 'date_submitted', 'status'])
  } catch (e) {
    return ModelResult.UNKNOWN_ERROR
  }

  // console.log(rows)

  if (rows.length === 0) {
    return { result: ModelResult.NOT_FOUND, papers: null }
  } else {
    return { result: ModelResult.FOUND, papers: rows }
  }
}


async function getAllPapers() {
}


module.exports = {
  addPaper,
  addRevision,
  getPaper,
  getPaperRevision,
  getPaperBlob,
  getUserPapers,
  getAllPapers,
  setRevisionDocument,
}
