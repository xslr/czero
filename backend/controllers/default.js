async function restart(req, res) {
  process.exit(1)
}


async function defaultAction(req, res) {

  // TODO: perform sanity checks. execute first run if required.

  res.status(200).send('nothing here')
}


module.exports = {
  restart,
  defaultAction
}
