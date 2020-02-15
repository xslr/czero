const controller = require('../controllers/conference');
const validator = require('../utils')


module.exports = (router) => {
  router.route('/conference')
        .get(controller.getAvailableConference)
        .post(controller.add)
        .put(validator.validateLoginToken, controller.update)

  router.route('/conference/admin')
        .get(validator.validateLoginToken, controller.getAllConference)

  /* TODO: figure out the flow for users joining the conference.
      1. how will it work for attendees vs other participant types
      2. how will payments be processed */

  // router.route('/conference/beginPayment')
  //   .post(validator.validateLoginToken, controller.beginPayment)

  router.route('/conference/paymentSuccess')
        .post(controller.paymentSuccess)

  router.route('/conference/paymentFail')
        .post(controller.paymentFail)

  router.route('/conference/:cid/join')
        .get(controller.sboxJoinConference)  // FIXME: sandbox frontend for testing only
        .post(validator.validateLoginToken,
              validator.appendUserLogin,
              validator.validateConferenceJoinability,
              controller.joinConference)

  router.route('/conference/:cid/setConferenceChair')
    .post(validator.validateLoginToken,
          validator.appendUserLogin,
          validator.validateOperatorToken,
          controller.setConferenceChair)

  router.route('/conference/:conferenceId')
        .get(validator.validateLoginToken, controller.getConferenceById)
        .patch(validator.validateLoginToken, controller.alterConferenceById)
}
