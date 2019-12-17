// const { stage } = require('../config')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE "tblConference" RESTART IDENTITY CASCADE')
    .finally(function () {
      // Inserts seed entries
      return knex('tblConference').insert([
        { name: 'SIGGRAPH 2020', dateStart: '2020-07-19', dateEnd: '2020-07-23', dateOpenToSubmit: '2020-01-01', dateSubmissionDeadline: '2020-02-29', datePaperAcceptConfirm: '2020-03-31', dateSubmitFinalDraft: '2020-05-15' },
      ])
    })
}
