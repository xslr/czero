exports.up = function(knex) {
  return knex.schema
    .createTable('reviewers', function(t) {
      t.integer('reviewer_id').unsigned().notNull()
      t.integer('paper_id').unsigned().notNull()
      t.integer('requestor_id').notNull()
      t.dateTime('date_requested').defaultTo(knex.fn.now())

      t.foreign('reviewer_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
      t.foreign('paper_id').references('id').inTable('papers').onDelete('CASCADE').onUpdate('CASCADE')
      t.foreign('requestor_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')

      t.primary(['reviewer_id', 'paper_id'])
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable('reviewers')
}
