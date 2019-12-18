const controller = require('../controllers/conference');
const validator = require('../utils')


module.exports = (router) => {
  router.route('/conference')
    .get(validator.validateLoginToken, controller.getAllConference)
    .post(controller.add)
    .put(validator.validateLoginToken, controller.update)

  /* TODO: figure out the flow for users joining the conference.
      1. how will it work for attendees vs other participant types
      2. how will payments be processed */

  // router.route('/conference/beginPayment')
  //   .post(validator.validateLoginToken, controller.beginPayment)

  router.route('/conference/paymentSuccess')
    .post(controller.paymentSuccess)

  router.route('/conference/paymentFail')
    .post(controller.paymentFail)

  router.route('/conference/:conferenceId/join')
    .get(controller.sboxJoinConference)  // FIXME: sandbox frontend for testing only
    .post(validator.validateLoginToken, validator.validateConferenceJoinability, controller.joinConference)

  router.route('/conference/:conferenceId')
    .get(validator.validateLoginToken, controller.getConferenceById)
}
