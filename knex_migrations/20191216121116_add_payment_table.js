
exports.up = function(knex) {
  return knex.schema
    .createTable('tblPayment', function(t) {
      t.increments('id').primary()
      t.integer('uid').unsigned().notNull()
      t.integer('cid').unsigned().notNull()
      t.decimal('amount').notNull()

      t.dateTime('initiatedAt', {useTz: true}).notNull().defaultTo(knex.fn.now())
      t.dateTime('confirmedAt', {useTz: true}).nullable()  // payment or cancellation timestamp

      t.string('extTransactionId').nullable()
      t.enum('status', [
        'CREATED',    // txn created but yet to start processing at payment gateway
        'PROCESSING', // txn processing at payment gateway
        'CANCELLED',  // txn cancelled without submitting to payment gateway
        'PAID',       // txn paid with confirmation by payment gateway
        'FAILED',     // txn processing completed by gateway with failed result
      ], { useNative: true, enumName: 'typePaymentStatus' }).notNull()

      t.foreign('uid').references('id').inTable('tblUser').onDelete('CASCADE').onUpdate('CASCADE')
      t.foreign('cid').references('id').inTable('tblConference').onDelete('CASCADE').onUpdate('CASCADE')
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable('tblPayment')
    .raw('DROP TYPE "typePaymentStatus"')
}
