exports.up = function(knex) {

  return knex.schema
    .createTable('conferences', function(t) {
      t.increments('id').primary()
      t.string('name').notNull()

      t.dateTime('date_start').notNull()
      t.dateTime('date_end').notNull()
      t.dateTime('date_open_to_submit').notNull()
      t.dateTime('date_submission_deadline').notNull()
      t.dateTime('date_paper_accept_confirm').notNull()
      t.dateTime('date_submit_final_draft').notNull()

      t.string('venue_line_1').nullable()
      t.string('venue_line_2').nullable()
      t.string('venue_line_3').nullable()
    })
    .createTable('conference_member', function(t) {
      t.integer('user_id').unsigned().notNull()
      t.integer('conference_id').unsigned().notNull()
      t.enum('role',
             ['program_chair', 'attendee', 'reviewer', 'author'],
             { useNative: true, enumName: 'type_conference_role' })
       .notNull()

      t.foreign('conference_id').references('id').inTable('conferences').onDelete('CASCADE').onUpdate('CASCADE')
      t.foreign('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
      t.primary(['conference_id', 'user_id', 'role'])
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable('conference_member')
    .dropTable('conferences')
    .raw('DROP TYPE "type_conference_role"')
}
