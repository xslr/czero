const defaultRoute = require('../controllers/default')
const conference = require('./conference')
const paper = require('./paper')
const users = require('./users')

module.exports = (router) => {
  router.route('/')
    .get(defaultRoute.default)

  conference(router)
  paper(router)
  users(router)

  return router
}
