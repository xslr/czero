const authModel = require('../models/auth')
const { HttpStatus, ModelResult } = require('../constants')


async function operator(req, rsp, next) {
  // unpack req
  let isOp = await authModel.isUserOperator(req.user.id)

  if (isOp) {
    next()
  } else {
    rsp.status(HttpStatus.HTTP_403_FORBIDDEN).send()
  }
}

function uploadPaper(req, rsp, next) {
}

function getPaper(req, rsp, next) {
}

let restrict = {
  uploadPaper,
  getPaper
}

let role = {
  operator
}

module.exports = {
  role,
  restrict
}
