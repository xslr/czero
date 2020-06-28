const controller = require('../controllers/users');
// const validator = require('../utils')
const { routeDebugger } = require('./debug')

const publicRoute = (router) => {
  router.route('/user')
        .post(routeDebugger, controller.add)

  router.route('/user/:userId')

  router.route('/user/:userId/reset_password')

  router.route('/login')
        .post(routeDebugger, controller.login)

  router.route('/logout')
}


const restrictedRoute = (router) => {
  router.route('/user')
        .get(routeDebugger, controller.getUserByAuthToken)
        .patch(routeDebugger, controller.update)

  router.route('/user/:userId')
        .delete(routeDebugger, controller.deactivate)
        .get(routeDebugger, controller.getUserById)

  router.route('/user/:userId/reset_password')
        .post(routeDebugger, controller.resetPassword)

  router.route('/logout')
        .post(routeDebugger, controller.logoutUser)
}


module.exports.public = publicRoute
module.exports.restrict = restrictedRoute