const controller = require('../controllers/users');
const validator = require('../utils')

module.exports = (router) => {
  router.route('/user')
        .get(validator.validateLoginToken, controller.getUserByAuthToken)
        .post(controller.add)
        .patch(validator.validateLoginToken, controller.update)

  router.route('/user/:userId')
        .delete(validator.validateLoginToken, controller.deactivate)
        .get(validator.validateLoginToken, controller.getUserById)

  router.route('/user/:userId/reset_password')
        .post(validator.validateLoginToken, controller.resetPassword)

  router.route('/login')
        .post(controller.login)

  router.route('/logout')
        .post(validator.validateLoginToken, controller.logoutUser)
}
