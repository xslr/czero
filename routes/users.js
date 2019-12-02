const controller = require('../controllers/users');
const validateToken = require('../utils')

module.exports = (router) => {
  router.route('/user')
    .post(controller.add)
    .get(validateToken.validateToken, controller.getAll);

  router.route('/user/:userId')
    .put(validateToken.validateToken, controller.update)
    .delete(validateToken.validateToken, controller.deactivate);

  router.route('/user/:userId/reset_password')
    .post(validateToken.validateToken, controller.requestReset);  // request password reset using specified email_address

  router.route('/login')
    .post(controller.login)
};
