exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(t) {
      t.increments('id').primary()
      t.dateTime('created_at', {useTz: true}).notNull().defaultTo(knex.fn.now())
      t.dateTime('updated_at', {useTz: true}).notNull().defaultTo(knex.fn.now())
      t.dateTime('deleted_at', {useTz: true}).nullable()

      t.string('first_name').notNull()
      t.string('middle_name').nullable()
      t.string('last_name').notNull()
      t.string('phone').nullable()
      t.string('address_line1').nullable()
      t.string('address_line2').nullable()
      t.string('address_city').nullable()
      t.string('address_zip').nullable()
      t.string('address_country').nullable()

      t.enum('status', ['active', 'inactive'], { useNative: true, enumName: 'type_user_status' }).notNull()
    })
    .createTable('email_logins', function(t) {
      t.string('email').primary().notNull()
      t.string('password_hash').notNull()
      t.integer('user_id').unsigned().notNull()

      t.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable('email_logins')
    .dropTable('users')
    .raw('DROP TYPE "type_user_status"')
}
