exports.up = function(knex) {
  return knex.schema
    .createTable('operators', function(t) {
      t.integer('user_id').unsigned().primary().notNull()
      t.foreign('user_id').references('id').inTable('users')
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable('operators')
}
