const PaperModel = require('../models/paper');
const { HttpStatus, ModelResult } = require('../constants')
const { stage } = require('../config')
const { unpackRequestBody, unpackRequestHeader } = require('./utils')


async function getAllUserPapers(req, rsp) {
  const uid = req.user.id
  // console.log(`uid = ${uid}`)
  const { result, papers } = await PaperModel.getUserPapers(uid)

  switch (result) {
    case ModelResult.FOUND:
      rsp.status(HttpStatus.HTTP_200_OK).send(papers)
      break;

    case ModelResult.NOT_FOUND:
      rsp.status(HttpStatus.HTTP_404_NOT_FOUND).send()
      break;

    default:
      rsp.status(HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR).send()
      break;
  }
}


async function addPaper(req, rsp) {
  var keys = ['cid', 'title', 'presenterId', 'uploaderId']

  // console.log(`body=${JSON.stringify(req.body)}`)

  const paper = unpackRequestBody(req.body, keys)
  const result = await PaperModel.addPaper(paper)

  rsp.status(HttpStatus.HTTP_200_OK).send(JSON.stringify(result))
}


async function getPaperById(req, rsp) {
  const pid = req.params.paperId

  const { result, paper } = await PaperModel.getPaper(pid)

  switch(result) {
    case ModelResult.FOUND:
      rsp.status(HttpStatus.HTTP_200_OK).send(paper)
      break;

    case ModelResult.NOT_FOUND:
      rsp.status(HttpStatus.HTTP_404_NOT_FOUND).send()
      break;

    default:
      rsp.status(HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR).send()
      break;
  }
}


async function getPaperByRevision(req, rsp) {
  const pid = req.params.paperId
  const rev = req.params.revisionId

  const { result, paper } = await PaperModel.getPaperRevision(pid, rev)

  switch(result) {
    case ModelResult.FOUND:
      rsp.status(HttpStatus.HTTP_200_OK).send(paper)
      break;

    case ModelResult.NOT_FOUND:
      rsp.status(HttpStatus.HTTP_404_NOT_FOUND).send()
      break;

    default:
      rsp.status(HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR).send()
      break;
  }
}


async function getPaperBlob(req, rsp) {
  const documentKey = req.params.documentKey

  const { result, paper } = await PaperModel.getPaperBlob(documentKey)

  // console.log(`da ${blob}`)

  switch(result) {
    case ModelResult.FOUND:
      rsp.set('CZero-Doc-MIME', paper.mimeType)
      rsp.set('CZero-Doc-Key', paper.uploadKey)
      rsp.status(HttpStatus.HTTP_200_OK).send(paper.blob)
      break;

    case ModelResult.NOT_FOUND:
      rsp.status(HttpStatus.HTTP_404_NOT_FOUND).send()
      break;

    default:
      rsp.status(HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR).send()
      break;
  }
}


async function deletePaper(req, rsp) {
  // TODO
  return { result: ModelResult.NOT_IMPLEMENTED }
}


async function alterPaper(req, rsp) {
  // TODO
  return { result: ModelResult.NOT_IMPLEMENTED }
}


async function addRevision(req, rsp) {
  var keys = ['abstract']

  // console.log(`body=${JSON.stringify(req.body)}`)

  const paperRevision = unpackRequestBody(req.body, keys)
  paperRevision.paperId = req.params.paperId

  const { result, revNum } = await PaperModel.addRevision(paperRevision)
  if (ModelResult.CREATED === result) {
    rsp.status(HttpStatus.HTTP_201_CREATED).send({
      uploadUrl: stage.apiUrl + `/paper/${paperRevision.paperId}/${revNum}`,
      uploadMethod: 'PUT',
    })
  } else if (ModelResult.NOT_FOUND === result) {
    rsp.status(HttpStatus.HTTP_404_NOT_FOUND).send()
  }
}


async function putRevisionDocBlob(req, rsp) {
  const docName = req.get('Document-Name')
  const docType = req.get('Content-Type')
  const docBlob = req.body
  const paperId = req.params.paperId
  const revisionId = req.params.revisionId
  const res = await PaperModel.setRevisionDocument(paperId, revisionId, docName, docType, docBlob)

  switch (res) {
    case ModelResult.ALTERED:
      rsp.status(HttpStatus.HTTP_201_CREATED).send()
      break;

    case ModelResult.NOT_FOUND:
      rsp.status(HttpStatus.HTTP_404_NOT_FOUND).send()
      break;

    default:
      rsp.status(HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR).send()
      break
  }
}


async function addReviewers(req, rsp) {
  const paperId = req.params.paperId
  const reviewers = req.body.reviewers
  const requesterId = req.user.id

  const { result, error_detail } = await PaperModel.addReviewers(reviewers, paperId, requesterId)

  switch (result) {
    case ModelResult.CREATED:
      rsp.status(HttpStatus.HTTP_201_CREATED).send()
      break;

    case ModelResult.NOT_FOUND:
      rsp.status(HttpStatus.HTTP_404_NOT_FOUND).send(error_detail)
      break;

    default:
      rsp.status(HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR).send(error_detail)
      break
  }
}


async function getPaperReviews(req, rsp) {
  // console.log(req.user)

  const paperId = req.params.paperId
  const paperRevision = req.params.revisionId

  let { result, reviews, error_detail } = await PaperModel.getPaperReviews(paperId, paperRevision)

  switch (result) {
    case ModelResult.FOUND:
      rsp.status(HttpStatus.HTTP_201_CREATED).send(reviews)
      break;

    case ModelResult.NOT_FOUND:
      rsp.status(HttpStatus.HTTP_404_NOT_FOUND).send(error_detail)
      break;

    default:
      rsp.status(HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR).send(error_detail)
      break
  }
}


async function addReview(req, rsp) {
  // console.log(req.user)

  const paperId = req.params.paperId
  const revisionId = req.params.revisionId
  const review = req.body.review
  const reviewerId = req.user.id

  const { result, error_detail } = await PaperModel.addReview(review, paperId, revisionId, reviewerId)

  switch (result) {
    case ModelResult.CREATED:
      rsp.status(HttpStatus.HTTP_201_CREATED).send()
      break;

    case ModelResult.NOT_FOUND:
      rsp.status(HttpStatus.HTTP_404_NOT_FOUND).send(error_detail)
      break;

    default:
      rsp.status(HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR).send(error_detail)
      break
  }
}


async function onPaperDecision(req, rsp) {
  // console.log(req.user)

  const paperId = req.params.paperId
  const user = req.user
  const decision = req.body.decision

  const { result, error_detail } = await PaperModel.setPaperDecision(paperId, user.id, decision)

  switch (result) {
    case ModelResult.ALTERED:
      rsp.status(HttpStatus.HTTP_200_OK).send()
      break;

    case ModelResult.NOT_FOUND:
      rsp.status(HttpStatus.HTTP_404_NOT_FOUND).send(error_detail)
      break;

    default:
      rsp.status(HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR).send(error_detail)
      break
  }
}


module.exports = {
  getAllUserPapers,
  addPaper,
  getPaperById,
  getPaperBlob,
  getPaperByRevision,
  deletePaper,
  alterPaper,
  addRevision,
  putRevisionDocBlob,
  addReviewers,
  getPaperReviews,
  addReview,
  onPaperDecision,
}
