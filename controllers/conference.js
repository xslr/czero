const ConferenceModel = require('../models/conference');
const PaymentModel = require('../models/payment')

const { mkResult } = require('../result_code')
const { HttpStatus, PaymentStatus } = require('../constants')
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


// sandbox to render payment page
async function sboxJoinConference(req, rsp) {
  console.log(req.params)
  const conferenceId = req.params.conferenceId

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
  const d = req.body

  // console.log(`d=${JSON.stringify(d)}`)

  var cryp = crypto.createHash('sha512')
  const text = stage.merchantKey+'|'+d.conferenceId+'|'+d.amount+'|'+d.pinfo+'|'+d.fname+'|'+d.email+'|||||'+d.udf5+'||||||'+stage.merchantSalt
  cryp.update(text)
  const hash = cryp.digest('hex')

  return hash
}


async function joinConference(req, rsp) {
  const hash = getRequestHash(req)

  console.log(`k=${stage.merchantKey}`)
  let status = HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR
  let response = req.body
  response.key = stage.merchantKey
  response.txnHash = hash
  response.surl = `http://${stage.ip}:${stage.port}/api/v0/conference/${req.params.conferenceId}/paymentSuccess`
  response.furl = `http://${stage.ip}:${stage.port}/api/v0/conference/${req.params.conferenceId}/paymentFail`

  // record payment transaction in db
  const p = {
    amount: req.body.amount,
    cid: req.params.conferenceId,
    email: req.decodedToken.email,
    status: PaymentStatus.PROCESSING,
  }
  const result = await PaymentModel.newPayment(p)

  if (0 === result.length) {
    response = null
  } else {
    delete response.authToken
    response.firstname = req.user.firstName
    response.middlename = req.user.middleName
    response.lastname = req.user.lastName
    response.txnId = `${result[0]}`
    status = HttpStatus.HTTP_200_OK
  }

  rsp.status(status).send(response)
}


async function paymentSuccess(req, rsp) {
  /*
  "key": "B3EAvK71",
  "salt": "dKemnHwDbX",
  "txnid": "1",
  "amount": "6.00",
  "productinfo": "P01,P02",
  "firstname": "MyFirstName",
  "email": "name@example.com",
  "udf5": "BOLT_KIT_NODE_JS",
  "mihpayid": "9083719147",
  "status": "success",
  "hash": "a9faa65ca8113da8ecb0c8f8d41d31e90c793975c65cf620d90bc725dec192b39033210548f715d7f3e2a72d62dcc47ec73c4d8cbccebcee09db68a31c21800d"
   */
  console.log(`paymentSuccess: ${JSON.stringify(req.body)}`)

  rsp.status(HttpStatus.HTTP_200_OK).send()
}


async function paymentFail(req, rsp) {
  console.log(`paymentFail: ${JSON.stringify(req.body)}`)

  rsp.status(HttpStatus.HTTP_200_OK).send()
}


module.exports = {
  add,
  update,
  getAllConference,
  getConferenceById,
  sboxJoinConference,  // endpoint to test joining a conference
  getRequestHash,
  joinConference,
  paymentSuccess,
  paymentFail,
}
