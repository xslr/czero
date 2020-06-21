const controller = require('../controllers/users');
const validator = require('../utils')
const { routeDebugger } = require('./debug')

module.exports = (router) => {
  router.route('/user')
        .get(routeDebugger, validator.validateLoginToken, controller.getUserByAuthToken)
        .post(routeDebugger, controller.add)
        .patch(routeDebugger, validator.validateLoginToken, controller.update)

  router.route('/user/:userId')
        .delete(routeDebugger, validator.validateLoginToken, controller.deactivate)
        .get(routeDebugger, validator.validateLoginToken, controller.getUserById)

  router.route('/user/:userId/reset_password')
        .post(routeDebugger, validator.validateLoginToken, controller.resetPassword)

  router.route('/login')
        .post(routeDebugger, controller.login)

  router.route('/logout')
        .post(routeDebugger, validator.validateLoginToken, controller.logoutUser)
}
