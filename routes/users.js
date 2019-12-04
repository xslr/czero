const controller = require('../controllers/users');
const validateToken = require('../utils')

module.exports = (router) => {
  router.route('/user')
    .post(controller.addUser)
    .get(validateToken.validateToken, controller.getAll);

  router.route('/user/:userId')
    .put(validateToken.validateToken, controller.update)
    .delete(validateToken.validateToken, controller.deactivate);

  router.route('/user/:userId/reset_password')
    .post(validateToken.validateToken, controller.requestReset)  // initiate a password reset using specified email_address
    .put(validateToken.validateToken, controller.setNewPassword);

  router.route('/login')
    .post(controller.login)
};
