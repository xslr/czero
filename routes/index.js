const defaultRoute = require('../controllers/default')
const users = require('./users')
const conference = require('./conference')

module.exports = (router) => {
  router.route('/')
    .get(defaultRoute.default)

  users(router)
  conference(router)

  return router;
};
