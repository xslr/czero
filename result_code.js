const ResultCode = Object.freeze({
  'ERR_UNKNOWN':1,
  'ERR_ACCOUNT_EXISTS':2,
  'OK_LOGIN_SUCCESS': 3,
  'ERR_INCORRECT_LOGIN': 4,
  'OK_ACCOUNT_CREATED': 5,
})

const HttpStatus = Object.freeze({
  // http 2xx
  'HTTP_200_OK':200,
  'HTTP_201_CREATED':201,

  // http 4xx
  'HTTP_400_BAD_REQUEST':400,
  'HTTP_401_UNAUTHORIZED':401,
  'HTTP_422_UNPROCESSABLE_ENTITY':422,

  // http 5xx
  'HTTP_500_INTERNAL_SERVER_ERROR':500,
})


function resultText(code) {
  if(Object.keys(ResultCode).length) {
    Object.keys(ResultCode).forEach(key => {
      if (Object.values(key) == code)
        return key
    })
  }
}

function mkResult(code, reason) {
  return {
    resultCode: code,
    resultText: resultText(code),
    reason: reason,
  }
}

module.exports = { ResultCode, HttpStatus, mkResult }
