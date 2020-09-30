const defaultRoute = require('../controllers/default')
const conference = require('./conference')
const paper = require('./paper')
const users = require('./user')

const routes = [
  conference,
  paper,
  users
];

const publicRoute = (router) => {
  router.route('/')
    .get(defaultRoute.defaultAction)
  router.route('/restart')
    .get(defaultRoute.restart)

  // console.log(routes[0])

  for (let route of routes) {
    if (route.public) {
      route.public(router)
    }
  }

  return router
}


const restrictedRoute = (router) => {
  for (let route of routes) {
    if (route.restricted) {
      route.restricted(router)
    }
  }

  return router
}


module.exports.public = publicRoute;
module.exports.restricted = restrictedRoute;