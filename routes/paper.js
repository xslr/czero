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

  router.route('/paper/:paperId/:revId')
        .get(validator.validateLoginToken, controller.getPaperByRevision)
        .put(validator.validateLoginToken, controller.putRevisionDocument)

  router.route('/paper/:paperId/:revId/:documentKey')
        .get(validator.validateLoginToken, controller.getPaperBlob)
}
