const PaperModel = require('../models/paper');
const PaymentModel = require('../models/payment')

const { mkResult } = require('../result_code')
const { ConferenceRole, HttpStatus, ModelResult, PaymentStatus, ResultCode } = require('../constants')
const crypto = require('crypto')

const { stage } = require('../config')


async function getAllUserPapers(req, rsp) {
    // TODO
}


function unpackRequest(body, keys) {
  var obj = {}
  keys.forEach(key => {
    // console.log(`body.${key}=${body[key]}`)
    obj[key] = body[key]
  })

  return obj
}


async function addPaper(req, rsp) {
  var keys = ['cid', 'title', 'presenterId', 'uploaderId']

  // console.log(`body=${JSON.stringify(req.body)}`)

  const paper = unpackRequest(req.body, keys)
  const result = await PaperModel.addPaper(paper)

  rsp.status(HttpStatus.HTTP_200_OK).send(JSON.stringify(result))
}


async function getPaperById(req, rsp) {
    // TODO
}


async function deletePaper(req, rsp) {
    // TODO
}


async function alterPaper(req, rsp) {
    // TODO
}


async function addRevision(req, rsp) {
  var keys = ['abstract']

  // console.log(`body=${JSON.stringify(req.body)}`)

  const paperRevision = unpackRequest(req.body, keys)
  paperRevision.paperId = req.params.paperId

  const {result, revNum} = await PaperModel.addRevision(paperRevision)
  if (ModelResult.CREATED === result) {
    rsp.status(HttpStatus.HTTP_201_CREATED).send({
      uploadUrl: stage.apiUrl + `/paper/${paperRevision.paperId}/${revNum}`,
      uploadMethod: 'PUT',
    })
  } else if (ModelResult.NOT_FOUND === result) {
    rsp.status(HttpStatus.HTTP_404_NOT_FOUND).send()
  }
}


async function putRevisionDocument(req, rsp) {
  console.log(`got revision document '${req.get('Document-Name')}' and length=${req.body.length}`)
  docName = req.get('Document-Name')
  docType = req.get('Content-Type')
  docBlob = req.body
  paperId = req.params.paperId
  revId = req.params.revId
  let res = await PaperModel.setRevisionDocument(paperId, revId, docName, docType, docBlob)

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


module.exports = {
  getAllUserPapers,
  addPaper,
  getPaperById,
  deletePaper,
  alterPaper,
  addRevision,
  putRevisionDocument,
}
