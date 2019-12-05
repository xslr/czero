const controller = require('../controllers/users');
const validateToken = require('../utils')

module.exports = (router) => {
  router.route('/user')
    .get(validateToken.validateToken, controller.getUserByEmail)
    .post(controller.add);

  router.route('/user/:userId')
    .delete(validateToken.validateToken, controller.deactivate)
    .get(validateToken.validateToken, controller.getUserById)
    .put(validateToken.validateToken, controller.update);

  router.route('/user/:userId/reset_password')
    .post(validateToken.validateToken, controller.resetPassword);

  router.route('/login')
    .post(controller.login)
};
