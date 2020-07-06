const { ResultCode } = require('./constants')


function resultText(code) {
  if (Object.keys(ResultCode).length) {
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


module.exports = { mkResult }
