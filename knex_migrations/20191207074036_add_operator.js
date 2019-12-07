exports.up = function(knex) {
  return knex.schema
    .createTable('tblOperator', function(t) {
      t.integer('userId').unsigned().primary().notNull()
      t.foreign('userId').references('id').inTable('tblUser')
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('tblOperator')
};
