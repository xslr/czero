const debug = true

function routeDebugger(req, rsp, next) {
  if (debug) {
    console.log(`req.body=${JSON.stringify(req.body)}`)
  }
  next()
}

module.exports = {
  routeDebugger
}
