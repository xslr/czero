const ConferenceModel = require('../models/conference');
const PaymentModel = require('../models/payment')

const { mkResult } = require('../result_code')
const { HttpStatus, ModelResult, PaymentStatus, ConferenceRole, ResultCode } = require('../constants')
const { unpackRequestBody, unpackRequestHeader } = require('./utils')
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


async function alterConferenceById(req, rsp) {
  // TODO
}


async function getAllConference(req, rsp) {
  // TODO
  let cs = await ConferenceModel.readAll()
  console.log(JSON.stringify(cs))

  rsp.status(HttpStatus.HTTP_200_OK).send({
    conferences: cs
    })
}


async function getAvailableConference(req, rsp) {
  // TODO
}


async function getConferenceById(req, rsp) {
  // TODO: check if user is allowed to see this conference

  let id = req.params.conferenceId
  if (id === null) {
    rsp.status(HttpStatus.HTTP_404_NOT_FOUND).send()
    return
  }

  let conf = await ConferenceModel.readById(id)

  console.log(conf)
  if (conf) {
    rsp.status(HttpStatus.HTTP_200_OK).send(conf)
  } else if (undefined === conf) {
    rsp.status(HttpStatus.HTTP_404_NOT_FOUND).send()
  } else {
    rsp.status(HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR).send()
  }
}


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


function getRequestHash(req, txnId) {
  const b = req.body
  const u = req.user

  var cryp = crypto.createHash('sha512')
  const text = stage.merchantKey+'|'+txnId+'|'+b.amount+'|'+b.pinfo+'|'+u.firstName+'|'+u.email+'|||||'+b.udf5+'||||||'+stage.merchantSalt
  cryp.update(text)
  const hash = cryp.digest('hex')

  return hash
}


async function joinConference(req, rsp) {
  const user = req.user
  const body = req.body

  // This endpoint should create a payment request object and send that as a response to the client.
  // The user can complete payment using the payment transaction id as a handle.
  // After the payment is successful (via /payment/success), the joining is complete and
  //   a confirmation/transaction id can be sent to user

  // TODO: implement closing of the conference joining procedure aafter payment completion

  let status = HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR
  let response = body
  response.key = stage.merchantKey
  response.surl = `http://${stage.ip}:${stage.port}/api/v0/conference/${req.params.cid}/paymentSuccess`
  response.furl = `http://${stage.ip}:${stage.port}/api/v0/conference/${req.params.cid}/paymentFail`

  // record payment transaction in db
  const p = {
    amount: body.amount,
    cid: req.params.cid,
    status: PaymentStatus.PROCESSING,
    firstname: user.firstName,
    email: user.email,
  }
  const result = await PaymentModel.newPayment(p)

  if (0 === result.length) {
    response = null
  } else {
    delete response.authToken

    response.email = user.email
    response.phone = user.phone
    response.firstname = user.firstName
    response.middlename = user.middleName
    response.lastname = user.lastName
    response.txnId = `${result[0]}`
    response.txnHash = getRequestHash(req, response.txnId)
    response.conferenceId = req.params.cid
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
  let httpStatus = HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR
  let httpResult = {}
  console.log(`paymentSuccess: ${JSON.stringify(req.body)}`)
  const body = req.body
  if (body.txnId === undefined) {
    httpStatus = HttpStatus.HTTP_400_BAD_REQUEST
    httpResult.error = 'txnId missing'
  } else if (body.status === undefined) {
    httpStatus = HttpStatus.HTTP_400_BAD_REQUEST
    httpResult.error = 'status missing'
  } else if (body.hash === undefined) {
    httpStatus = HttpStatus.HTTP_400_BAD_REQUEST
    httpResult.error = 'hash missing'
  } else if (body.mihpayid === undefined) {
    httpStatus = HttpStatus.HTTP_400_BAD_REQUEST
    httpResult.error = 'mihpayid missing'
  } else if (body.status === 'success' /* && TODO: validate confirmation hash */) {
    let result = await PaymentModel.paymentSuccess(body.txnId, body.mihpayid)
    const role = ConferenceRole.attendee
    if (1 === result.length) {
      const assignResult = await ConferenceModel.assignRoleByUserId(result[0].cid, result[0].uid, role)
      if (ResultCode.OK === assignResult) {
        httpStatus = HttpStatus.HTTP_200_OK
        httpResult = { cid: result[0].cid, role: role }
      } else {
        // error handling
        if (ResultCode.ERR_DUPLICATE_ENTRY === assignResult) {
          httpStatus = HttpStatus.HTTP_422_UNPROCESSABLE_ENTITY
          httpResult = { error: 'The user is already assigned that role in the conference.' }
        } else {
          httpStatus = HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR
          console.log(`Could not add user to conference. ar=${assignResult} r=${JSON.stringify(result[0])}`)
        }
      }
    } else {
      httpStatus = HttpStatus.HTTP_422_UNPROCESSABLE_ENTITY
      httpResult = { txnId: body.txnId }
    }
  }

  rsp.status(httpStatus).send(httpResult)
}


async function paymentFail(req, rsp) {
  console.log(`paymentFail: ${JSON.stringify(req.body)}`)

  rsp.status(HttpStatus.HTTP_200_OK).send()
}


async function addUserToProgramCommittee(req, rsp) {
  const bodyFields = ['email']

  // console.log(`body=${JSON.stringify(req.body)}`)

  const { email } = unpackRequestBody(req.body, bodyFields)
  const { conferenceId } = req.params.conferenceId

  const { result, error_detail } = ConferenceModel.addUserToProgramCommittee(conferenceId, email)

  switch (result) {
    case ModelResult.ALTERED:
      rsp.status(HttpStatus.HTTP_200_OK).send()
      break;

    case ModelResult.NO_CHANGE_REQUIRED:
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


async function setConferenceChair(req, rsp) {
  const bodyFields = ['email']
  const { email } = unpackRequestBody(req.body, bodyFields)
  const { conferenceId } = req.params.conferenceId

  const { result, error_detail } = ConferenceModel.setConferenceChair(conferenceId, email)

  switch (result) {
    case ModelResult.ALTERED:
      rsp.status(HttpStatus.HTTP_200_OK).send()
      break;

    case ModelResult.NO_CHANGE_REQUIRED:
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
  add,
  update,
  getAllConference,
  getAvailableConference,
  getConferenceById,
  sboxJoinConference,  // endpoint to test joining a conference
  getRequestHash,
  joinConference,
  paymentSuccess,
  paymentFail,
  setConferenceChair,
  alterConferenceById,
  addUserToProgramCommittee,
}
