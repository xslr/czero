exports.up = function(knex) {
  return knex.schema
    .createTable('reviews', function(t) {
      t.increments('id').primary()
      t.string('review').notNull()
      t.integer('reviewer_id').unsigned().notNull()
      t.integer('revision_id').unsigned().notNull()
      t.dateTime('date_reviewed').defaultTo(knex.fn.now())

      t.foreign('reviewer_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
      t.foreign('revision_id').references('revision_id').inTable('paper_revisions').onDelete('CASCADE').onUpdate('CASCADE')
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable('reviews')
}
