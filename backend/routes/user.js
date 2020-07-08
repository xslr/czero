const controller = require('../controllers/users');


const publicRoute = (router) => {
  router.route('/user')
        .post(controller.add)

  router.route('/login')
        .post(controller.login)

  router.route('/logout')
}


const restrictedRoute = (router) => {
  router.route('/user')
        .get(controller.getUserByAuthToken)
        .patch(controller.update)

  router.route('/user/:userId')
        .delete(controller.deactivate)
        .get(controller.getUserById)

  router.route('/user/:userId/reset_password')
        .post(controller.resetPassword)

  router.route('/logout')
        .post(controller.logoutUser)
}


module.exports.public = publicRoute
module.exports.restrict = restrictedRoute