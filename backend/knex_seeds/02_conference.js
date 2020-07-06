
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE "conferences" RESTART IDENTITY CASCADE')
    .finally(function () {
      // Inserts seed entries
      return knex('conferences').insert([
        { name: 'SIGGRAPH 2020', date_start: '2020-07-19', date_end: '2020-07-23', date_open_to_submit: '2020-01-01', date_submission_deadline: '2020-02-29', date_paper_accept_confirm: '2020-03-31', date_submit_final_draft: '2020-05-15' },
        { name: '.Net Day Franken 2020', date_start: '2020-04-24', date_end: '2020-04-25', date_open_to_submit: '2020-01-01', date_submission_deadline: '2020-02-29', date_paper_accept_confirm: '2020-03-31', date_submit_final_draft: '2020-05-15' },
        { name: 'DWX - Developer Week \'20', date_start: '2020-06-29', date_end: '2020-07-03', date_open_to_submit: '2020-01-01', date_submission_deadline: '2020-02-29', date_paper_accept_confirm: '2020-03-31', date_submit_final_draft: '2020-05-15' },
        { name: 'EURO FINANCE WEEK 2020', date_start: '2020-11-16', date_end: '2020-11-20', date_open_to_submit: '2020-01-01', date_submission_deadline: '2020-02-29', date_paper_accept_confirm: '2020-03-31', date_submit_final_draft: '2020-05-15' },
      ])
    })
}
