const defaultRoute = require('../controllers/default')
const users = require('./users');

module.exports = (router) => {
  router.route('/')
    .get(defaultRoute.default)

  users(router);

  return router;
};
