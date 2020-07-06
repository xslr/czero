

function unpackRequestBody(body, keys) {
  var obj = {}
  keys.forEach(key => {
    // console.log(`body.${key}=${body[key]}`)
    obj[key] = body[key]
  })

  return obj
}


function unpackRequestHeader(req, keys) {
  var obj = {}
  keys.forEach(key => {
    // console.log(`body.${key}=${body[key]}`)
    obj[key] = req.get(key)
  })

  return obj
}


module.exports = {
  unpackRequestHeader,
  unpackRequestBody,
}
