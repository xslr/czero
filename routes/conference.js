const controller = require('../controllers/conference');
const validator = require('../utils')


const publicRoute = (router) => {
  router.route('/conference')
        .get(controller.getAvailableConference)
        .post(controller.add)

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
}


const restrictedRoute = (router) => {
  router.route('/conference')
        .put(controller.update)

  router.route('/conference/admin')
        .get(controller.getAllConference)

  router.route('/conference/:cid/join')
        .post(validator.appendUserLogin,
              validator.validateConferenceJoinability,
              controller.joinConference)

  router.route('/conference/:cid/setConferenceChair')
    .post(validator.appendUserLogin,
          validator.validateOperatorToken,
          controller.setConferenceChair)

  router.route('/conference/:conferenceId')
        .get(controller.getConferenceById)
        .patch(controller.alterConferenceById)

  router.route('/conference/:conferenceId/pc')
        .post(controller.addUserToProgramCommittee)
        // .delete(controller.alterConferenceById)  // TODO: Remove user from program committee
}


module.exports.public = publicRoute
module.exports.restrict = restrictedRoute