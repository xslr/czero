const ResultCode = Object.freeze({
  'ERR_UNKNOWN':1,
  'ERR_ACCOUNT_EXISTS':2,
  'OK_LOGIN_SUCCESS': 3,
  'ERR_INCORRECT_LOGIN': 4,
  'OK_ACCOUNT_CREATED': 5,
  'ERR_UNKNOWN_USER_ID': 6,
  'ERR_UNKNOWN_USER_EMAIL': 7,
  'ERR_AUTH_TOKEN_MISSING': 8,
  'ERR_MISSING_DATA': 9,
  'ERR_INVALID_ROLE': 10,
})

const HttpStatus = Object.freeze({
  // http 2xx
  'HTTP_200_OK':200,
  'HTTP_201_CREATED':201,

  // http 4xx
  'HTTP_400_BAD_REQUEST':400,
  'HTTP_401_UNAUTHORIZED':401,
  'HTTP_404_NOT_FOUND':404,
  'HTTP_422_UNPROCESSABLE_ENTITY':422,

  // http 5xx
  'HTTP_500_INTERNAL_SERVER_ERROR':500,
})

const PaymentStatus = Object.freeze({
  'CREATED': 0,
  'PROCESSING': 1,
  'CANCELLED': 2,
  'FAILED': 3,
  'PAID': 4,
})

const ConferenceStatus = Object.freeze({
  'NO_CONFERENCE': 0,
  'OPEN': 1,
  'ACTIVE': 2,
  'CLOSED': 3,
})

function paymentStatusAsString(status) {
  return Object.keys(PaymentStatus)[status]
}

module.exports = {
  ResultCode,
  HttpStatus,
  PaymentStatus,
  ConferenceStatus,
  paymentStatusAsString,
}
