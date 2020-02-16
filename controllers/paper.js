const PaperModel = require('../models/paper');

const { HttpStatus, ModelResult } = require('../constants')

const { stage } = require('../config')


async function getAllUserPapers(req, rsp) {
  const uid = req.user.id
  console.log(`uid = ${uid}`)
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
  const rev = req.params.revId

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
  const docName = req.get('Document-Name')
  const docType = req.get('Content-Type')
  const docBlob = req.body
  const paperId = req.params.paperId
  const revId = req.params.revId
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
  getPaperBlob,
  getPaperByRevision,
  deletePaper,
  alterPaper,
  addRevision,
  putRevisionDocument,
}
