const defaultRoute = require('../controllers/default')
const conference = require('./conference')
const paper = require('./paper')
const users = require('./user')

module.exports = (router) => {
  router.route('/')
    .get(defaultRoute.defaultAction)
  router.route('/restart')
  	.get(defaultRoute.restart)

  conference(router)
  paper(router)
  users(router)

  return router
}
