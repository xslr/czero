const controller = require('../controllers/paper');
const validator = require('../utils')
const auth = require('../src/authorization')


const publicRoute = (router) => {
  /* no public route */
}

// paper rights:
//  - author
//  - reviewer
//  - track_chair
//  - program_chair

const restrictedRoute = (router) => {
  router.route('/paper')
        // only for testing operator role checks
        //.get(validator.appendUserLogin, auth.role.operator, controller.getAllUserPapers)
        .get(validator.appendUserLogin, controller.getAllUserPapers)
        .post(auth.restrict.uploadPaper, controller.addPaper)

  router.route('/paper/:paperId')
        .get(controller.getPaperById)
        .delete(controller.deletePaper)
        .patch(controller.alterPaper)
        .post(controller.addRevision)

  router.route('/paper/:paperId/:revisionId')
        .get(controller.getPaperByRevision)
        .put(controller.putRevisionDocBlob)

  router.route('/paper/:paperId/:revisionId/review')
        .get(/*TODO: validateRightToGetReviews,*/ controller.getPaperReviews)
        .post(validator.appendUserLogin, /*TODO: validateRightToReview,*/ controller.addReview)

  router.route('/paper/:paperId/:revisionId/:documentKey')
        .get(controller.getPaperBlob)

  router.route('/paper/:paperId/reviewer')
        .post(validator.appendUserLogin, /*TODO: validateAssignReviewerRights,*/ controller.addReviewers)

  router.route('/paper/:paperId/decide')
        .post(validator.appendUserLogin, /*TODO: validateRightToDecidePaper,*/ controller.onPaperDecision)
}


module.exports.public = publicRoute;
module.exports.restricted = restrictedRoute;