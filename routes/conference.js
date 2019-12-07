const controller = require('../controllers/conference');
const validateToken = require('../utils')


module.exports = (router) => {
  router.route('/conference')
    .get(validateToken.validateToken, /*verifyGetConferenceDataRight,*/ controller.getAllConference)
    .post(/*verifyAddConferenceRight,*/ controller.add)
    .put(validateToken.validateToken, /*verifyConferenceModifyRight,*/ controller.update)

  /* TODO: figure out the flow for users joining the conference.
      1. how will it work for attendees vs other participant types
      2. how will payments be processed */

  router.route('/conference/:conferenceId/join')
    .post(/*verifyUserToken and maybe payment token,*/ controller.addParticipant)

  router.route('/conference/:conferenceId')
    .get(validateToken.validateToken, controller.getConferenceById)
}
