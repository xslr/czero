const Result = Object.freeze({
  'ERR_UNKNOWN':1,
  'ERR_ACCOUNT_EXISTS':2,

  // http 2xx
  'HTTP_201_CREATED':201,
  // http 4xx
  'HTTP_422_UNPROCESSABLE_ENTITY':422,
  // http 5xx
  'HTTP_500_INTERNAL_SERVER_ERROR':500,
})

module.exports = Result
