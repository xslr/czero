exports.up = function(knex) {
  return knex.schema
    .createTable('tblUser', function(t) {
      t.increments('id').primary()
      t.dateTime('createdAt', {useTz: true}).notNull().defaultTo(knex.fn.now())
      t.dateTime('updatedAt', {useTz: true}).notNull().defaultTo(knex.fn.now())
      t.dateTime('deletedAt', {useTz: true}).nullable()

      t.string('firstName').notNull()
      t.string('middleName').nullable()
      t.string('lastName').notNull()
      t.string('phone').nullable()
      t.string('addressLine1').nullable()
      t.string('addressLine2').nullable()
      t.string('addressCity').nullable()
      t.string('addressZip').nullable()
      t.string('addressCountry').nullable()

      t.enum('status', ['active', 'inactive'], { useNative: true, enumName: 'typeUserStatus' }).notNull()
    })
    .createTable('tblEmailLogin', function(t) {
      t.string('email').primary().notNull()
      t.string('pwHash').notNull()
      t.integer('userId').unsigned().notNull()

      t.foreign('userId').references('id').inTable('tblUser').onDelete('CASCADE')
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable('tblEmailLogin')
    .dropTable('tblUser')
    .raw('DROP TYPE "typeUserStatus"')
}
