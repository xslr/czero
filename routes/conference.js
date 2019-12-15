const controller = require('../controllers/conference');
const validateToken = require('../utils')


module.exports = (router) => {
  router.route('/sandbox/getHash')
    .post(controller.getRequestHash)

  router.route('/conference')
    .get(validateToken.validateToken, controller.getAllConference)
    .post(controller.add)
    .put(validateToken.validateToken, controller.update)

  /* TODO: figure out the flow for users joining the conference.
      1. how will it work for attendees vs other participant types
      2. how will payments be processed */

  router.route('/conference/beginPayment')
    .post(controller.beginPayment)

  router.route('/conference/:conferenceId/join')
    .get(controller.sboxJoinConference)  // TODO: replace with actual frontend
    .post(controller.beginRegistration)

  router.route('/conference/:conferenceId')
    .get(validateToken.validateToken, controller.getConferenceById)
}
