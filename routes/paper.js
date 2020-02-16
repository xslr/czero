const controller = require('../controllers/paper');
const validator = require('../utils')

module.exports = (router) => {
  router.route('/paper')
        .get(validator.validateLoginToken, validator.appendUserLogin, controller.getAllUserPapers)
        .post(validator.validateLoginToken, controller.addPaper)

  router.route('/paper/:paperId')
        .get(validator.validateLoginToken, controller.getPaperById)
        .delete(validator.validateLoginToken, controller.deletePaper)
        .patch(validator.validateLoginToken, controller.alterPaper)
        .post(validator.validateLoginToken, controller.addRevision)

  router.route('/paper/:paperId/:revisionId')
        .get(validator.validateLoginToken, controller.getPaperByRevision)
        .put(validator.validateLoginToken, controller.putRevisionDocBlob)

  router.route('/paper/:paperId/:revisionId/:documentKey')
        .get(validator.validateLoginToken, controller.getPaperBlob)

  router.route('/paper/:paperId/reviewer')
        .post(validator.validateLoginToken, validator.appendUserLogin, /*TODO: validateAssignReviewerRights,*/ controller.addReviewers)

  router.route('/paper/:paperId/:revisionId/review')
        .get(validator.validateLoginToken, /*TODO: validateRightToGetReviews,*/ controller.getReviews)
        .post(validator.validateLoginToken, validator.appendUserLogin, /*TODO: validateRightToReview,*/ controller.addReview)

  router.route('/paper/:paperId/decide')
        .post(validator.validateLoginToken, /*TODO: validateRightToDecidePaper,*/ controller.onPaperDecision)
}
