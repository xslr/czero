const controller = require('../controllers/conference');
const validateToken = require('../utils')


module.exports = (router) => {
  router.route('/conference')
    .get(validateToken.validateToken, /*verifyGetConferenceDataRight,*/ controller.getConference)
    .post(/*verifyAddConferenceRight,*/ controller.add)
    .put(validateToken.validateToken, /*verifyConferenceModifyRight,*/ controller.update)

  router.route('/user/:userId')
    .delete(validateToken.validateToken, controller.deactivate)
    .get(validateToken.validateToken, controller.getUserById)

  router.route('/user/:userId/reset_password')
    .post(validateToken.validateToken, controller.resetPassword)

  router.route('/login')
    .post(controller.login)
}
