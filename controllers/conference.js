const ConferenceModel = require('../models/conference');

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const validator = require('validator')
// const { knex } = require('../models/dbconnection')
const { ResultCode, HttpStatus, mkResult } = require('../result_code')
const crypto = require('crypto')

const { stage } = require('../config')


async function add(req, rsp) {
  let status = HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR
  let result = null

  try {
    const conf = JSON.parse(req.body.conference)
    if (conf) {
      await ConferenceModel.create(conf)
        .then(res => {
          status = HttpStatus.HTTP_201_CREATED
          result = res
        })
        .catch(err => {
          console.error(`Error while creating conference: ${err}`)
        })
    } else {
      status = HttpStatus.HTTP_400_BAD_REQUEST
      result = 'Could not find any conference params in request body.'
    }
  } catch (e) {
    if (e instanceof SyntaxError) {
      status = HttpStatus.HTTP_400_BAD_REQUEST
      result = `Conference JSON could not be parsed:\n${JSON.stringify(e)}`
    } else {
      result = JSON.stringify(e)
    }
  } finally {
    rsp.status(status).send(result)
  }
}


async function update(req, rsp) {
  let status = HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR
  let result = null

  try {
    const conf = JSON.parse(req.body.conferenceUpdate)
    /*
    if (conf) {
      await ConferenceModel.update(conf)
        .then(res => {
          status = HttpStatus.HTTP_201_CREATED
          result = res
        })
        .catch(err => {
          console.error(`Error while creating conference: ${err}`)
        })
    } else {
      status = HttpStatus.HTTP_400_BAD_REQUEST
      result = 'Could not find any conference params in request body.'
    }
    */
  } catch (e) {
    if (e instanceof SyntaxError) {
      status = HttpStatus.HTTP_400_BAD_REQUEST
      result = `Conference JSON could not be parsed:\n${JSON.stringify(e)}`
    } else {
      result = JSON.stringify(e)
    }
  } finally {
    rsp.status(status).send(result)
  }
}


async function getAllConference(req, rsp) {}


async function getConferenceById(req, rsp) {}


function mkPayUPaymentRequest() {
  return {

  }
}


async function beginRegistration(req, rsp) {
  // prepare payment request
  // post to payment url of payumoney
}


async function sboxJoinConference(req, rsp) {
  console.log(req.params)
  conferenceId = req.params.conferenceId

  rsp.render(__dirname + '/../sandbox/sbox_joinconference.html', {
    conferenceId: conferenceId,
    key: stage.merchantKey,
    salt: stage.merchantSalt,
    ip: stage.ip,
    port: stage.port,
    surl: `http://${stage.ip}:${stage.port}/api/v0/conference/paymentSuccess`,
    furl: `http://${stage.ip}:${stage.port}/api/v0/conference/paymentFail`,
  })

  // rsp.status(HttpStatus.HTTP_200_OK).send(conferenceId)
}


function getRequestHash(req) {
  d = req.body

  // console.log(`d=${JSON.stringify(d)}`)

  var cryp = crypto.createHash('sha512')
  const text = stage.merchantKey+'|'+d.conferenceId+'|'+d.amount+'|'+d.pinfo+'|'+d.fname+'|'+d.email+'|||||'+d.udf5+'||||||'+stage.merchantSalt
  cryp.update(text)
  hash = cryp.digest('hex')

  return hash
}


async function beginPayment(req, rsp) {
  const hash = getRequestHash(req)

  let response = req.body
  response.merchantKey = stage.merchantKey
  response.transactionHash = hash
  response.surl = `http://${stage.ip}:${stage.port}/api/v0/conference/paymentSuccess`
  response.furl = `http://${stage.ip}:${stage.port}/api/v0/conference/paymentFail`

  rsp.status(HttpStatus.HTTP_200_OK).send(response)
}


async function paymentSuccess(req, rsp) {
  console.log(`paymentSuccess: ${JSON.stringify(req.body)}`)

  rsp.status(HttpStatus.HTTP_200_OK).send()
}


async function paymentFail(req, rsp) {
  console.log(`paymentFail: ${JSON.stringify(req.body)}`)

  rsp.status(HttpStatus.HTTP_200_OK).send()
}


async function paymentGatewayReturn(req, rsp) {
  console.log(`paymentGatewayReturn: ${JSON.stringify(req.body)}`)

  rsp.status(HttpStatus.HTTP_200_OK).send()
}


module.exports = {
  add,
  update,
  getAllConference,
  getConferenceById,
  beginRegistration,
  sboxJoinConference,  // endpoint to test joining a conference
  getRequestHash,
  beginPayment,
  paymentSuccess,
  paymentFail,
  paymentGatewayReturn,
}
