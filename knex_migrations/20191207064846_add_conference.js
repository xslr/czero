exports.up = function(knex) {

  return knex.schema
    .createTable('tblConference', function(t) {
      t.increments('id').primary()
      t.string('name').notNull()

      t.dateTime('dateStart').notNull()
      t.dateTime('dateEnd').notNull()
      t.dateTime('dateOpenToSubmit').notNull()
      t.dateTime('dateSubmissionDeadline').notNull()
      t.dateTime('datePaperAcceptConfirm').notNull()
      t.dateTime('dateSubmitFinalDraft').notNull()

      t.string('venueLine1').nullable()
      t.string('venueLine2').nullable()
      t.string('venueLine3').nullable()
    })
    .createTable('tblConferenceMember', function(t) {
      t.integer('userId').unsigned().notNull()
      t.integer('conferenceId').unsigned().notNull()
      t.enum('role',
             ['program_chair', 'attendee', 'reviewer', 'author'],
             { useNative: true, enumName: 'typeConferenceRole' })
       .notNull()

      t.foreign('conferenceId').references('id').inTable('tblConference').onDelete('CASCADE').onUpdate('CASCADE')
      t.foreign('userId').references('id').inTable('tblUser').onDelete('CASCADE').onUpdate('CASCADE')
      t.primary(['conferenceId', 'userId', 'role'])
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable('tblConferenceMember')
    .dropTable('tblConference')
    .raw('DROP TYPE "typeConferenceRole"')
}
