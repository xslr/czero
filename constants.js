const ResultCode = Object.freeze({
  'OK': 1,
  'ERR_UNKNOWN': 2,
  'ERR_ACCOUNT_EXISTS': 3,
  'OK_LOGIN_SUCCESS': 4,
  'ERR_INCORRECT_LOGIN': 5,
  'OK_ACCOUNT_CREATED': 6,
  'ERR_UNKNOWN_USER_ID': 7,
  'ERR_UNKNOWN_USER_EMAIL': 8,
  'ERR_AUTH_TOKEN_MISSING': 9,
  'ERR_MISSING_DATA': 10,
  'ERR_INVALID_ROLE': 11,
  'ERR_INVALID_CONFERENCE': 12,
  'ERR_DUPLICATE_ENTRY': 13,
})

const HttpStatus = Object.freeze({
  // http 2xx
  'HTTP_200_OK':200,
  'HTTP_201_CREATED':201,

  // http 4xx
  'HTTP_400_BAD_REQUEST':400,
  'HTTP_401_UNAUTHORIZED':401,
  'HTTP_403_FORBIDDEN':403,
  'HTTP_404_NOT_FOUND':404,
  'HTTP_422_UNPROCESSABLE_ENTITY':422,

  // http 5xx
  'HTTP_500_INTERNAL_SERVER_ERROR':500,
})

const ModelResult  = Object.freeze({
  'NOT_FOUND': -3,
  'INVALID_PARAM': -2,
  'UNKNOWN_ERROR': -1,
  'CREATED': 0,
  'ALTERED': 1,
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

const ConferenceRole = Object.freeze({
  'program_chair': 0,
  'attendee': 1,
  'reviewer': 2,
  'author': 3,
})

function enumAsString(type, val) {
  return Object.keys(type)[val];
}

module.exports = {
  enumAsString,
  ResultCode,
  HttpStatus,
  PaymentStatus,
  ConferenceStatus,
  ConferenceRole,
  ModelResult,
}
