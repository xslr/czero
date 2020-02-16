const { knex } = require('./dbconnection')
const { ResultCode } = require('../result_code')
const { ModelResult } = require('../constants')
const UserModel = require('./users')


async function addPaper(p) {
  return ModelResult.UNKNOWN_ERROR
}


function isPaperRevisionValid(paperRevision) {
  // TODO
  return true
}


async function getLastRevision(paperId) {
  let res = await knex('paper_revisions')
    .max('paper_revision')
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
      paper_revision: nextRevision,
      abstract: paperRevision.abstract,
      paperId: paperRevision.paperId,
    }, 'paper_revision')
    .into('paper_revisions')
    .then(paper_revision => {
      // console.log(`Added revision number ${paper_revision}`)
      return { result: ModelResult.CREATED, revNum: paper_revision }
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
      .where({paperId: paperId, paper_revision: revNum})
      .update({upload_id: newUploadId}, 'paper_revision')

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
          { revNum: 'paper_revisions.paper_revision' },
          { abstract: 'paper_revisions.abstract' },
          { docName:  'binaries.name' },
          { docKey: 'paper_revisions.upload_id' },  // TODO: implement a randomized upload key instead of exposing the document id
          ])
      .where('papers.id', paperId)
      .orderBy('paper_revisions.paper_revision', 'desc')
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
          { revNum: 'paper_revisions.paper_revision' },
          { abstract: 'paper_revisions.abstract' },
          { docName:  'binaries.name' },
          { docKey: 'paper_revisions.upload_id' },  // TODO: implement a randomized upload key instead of exposing the document id
          ])
      .where({
          'papers.id': paperId,
          'paper_revisions.paper_revision': revNum,
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


async function addReviewers(reviewers, paperId, requesterId) {
  let insertedRows = []
  let reviewerRows = []
  for (let reviewerEmail of reviewers) {
    const user = await UserModel.getUserByEmail(reviewerEmail)
    reviewerRows.push({
          reviewer_id: user.id,
          paper_id: paperId,
          requestor_id: requesterId,
        })
  }

  // console.log(reviewerRows)

  try {
    insertedRows = await knex('reviewers')
        .insert(reviewerRows, 'reviewer_id')
  } catch (e) {
    // console.log(e)
    if (23503 === Number(e.code)) {
      if (/^Key \(paper_id\).+is not present in table/.test(e.detail)) {
        return { result: ModelResult.NOT_FOUND, error_detail: 'Paper not found.' }
      } else if (/^Key \(reviewer_id\).+is not present in table/.test(e.detail)) {
        return { result: ModelResult.NOT_FOUND, error_detail: 'Reviewer not found.' }
      }
    }
    return { result: ModelResult.UNKNOWN_ERROR, error_detail: e }
  }

  // console.log(insertedRows)

  if (insertedRows.length > 0) {
    return { result: ModelResult.CREATED }
  } else {
    return { result: ModelResult.UNKNOWN_ERROR }
  }
}


async function getPaperReviews(paperId, paperRevision) {
  let rows = null

  const getReviewsWithRevIdQuery = knex('reviews')
    .join('paper_revisions', 'reviews.revision_id', 'paper_revisions.revision_id')
    .where('paper_revisions.paper_id', paperId)
    .select(['paper_revisions.paper_revision', 'reviews.review', 'reviews.reviewer_id', 'reviews.date_reviewed'])
    .as('paper_reviews')

  let getReviewsForRevisionQuery = undefined
  if (undefined == paperRevision) {
    getReviewsForRevisionQuery = knex(getReviewsWithRevIdQuery)
      .select(['paper_reviews.paper_revision', 'paper_reviews.review', 'paper_reviews.reviewer_id', 'paper_reviews.date_reviewed'])
  } else {
    getReviewsForRevisionQuery = knex(getReviewsWithRevIdQuery)
      .where('paper_reviews.paper_revision', paperRevision)
      .select(['paper_reviews.paper_revision', 'paper_reviews.review', 'paper_reviews.reviewer_id', 'paper_reviews.date_reviewed'])
  }

  // console.log(getReviewsForRevisionQuery.toSQL())

  try {
    rows = await getReviewsForRevisionQuery
  } catch (e) {
    return { result: ModelResult.UNKNOWN_ERROR, error_detail: e }
  }

  // console.log(rows)

  if (0 === rows.length) {
    return { result: ModelResult.NOT_FOUND, reviews: null }
  } else {
    return { result: ModelResult.FOUND, reviews: rows }
  }
}


async function addReview(review, paperId, paperRevision, reviewerId) {
  // do not check if reviewerId is allowed to review paperId, as that was already checked while routing by a middleware function
  let insertedRows = []

  const revisionIdSubQuery = knex('paper_revisions')
    .where({ paper_id: paperId, paper_revision: paperRevision })
    .first('revision_id')

  const insertionQuery = knex('reviews')
    .insert({
      review: review,
      reviewer_id: reviewerId,
      revision_id: revisionIdSubQuery,
    }, 'reviews.id')
  // console.log(insertionQuery.toSQL())

  try {
    insertedRows = await insertionQuery
  } catch (e) {
    // console.log(e)
    const errorCode = Number(e.code)
    if (23503 === errorCode) {
      if (/^Key \(reviewer_id\).+is not present in table/.test(e.detail)) {
        return { result: ModelResult.NOT_FOUND, error_detail: 'Reviewer not found.' }
      }
    } else if (23502 === errorCode) {
      if ('revision_id' == e.column) {
        return { result: ModelResult.NOT_FOUND, error_detail: 'Paper or revision not found.' }
      }
    }
    return { result: ModelResult.UNKNOWN_ERROR, error_detail: e }
  }

  // console.log(insertedRows)

  if (1 === insertedRows.length) {
    return { result: ModelResult.CREATED }
  } else {
    return { result: ModelResult.UNKNOWN_ERROR }
  }
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
  addReviewers,
  getPaperReviews,
  addReview,
}
