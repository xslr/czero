
exports.up = function(knex) {
  return knex.schema
    .createTable('payments', function(t) {
      t.increments('id').primary()
      t.integer('uid').unsigned().notNull()
      t.integer('cid').unsigned().notNull()
      t.decimal('amount').notNull()

      t.dateTime('initiated_at', {useTz: true}).notNull().defaultTo(knex.fn.now())
      t.dateTime('confirmed_at', {useTz: true}).nullable()  // payment or cancellation timestamp

      t.string('ext_transaction_id').nullable()
      t.enum('status', [
        'CREATED',    // txn created but yet to start processing at payment gateway
        'PROCESSING', // txn processing at payment gateway
        'CANCELLED',  // txn cancelled without submitting to payment gateway
        'PAID',       // txn paid with confirmation by payment gateway
        'FAILED',     // txn processing completed by gateway with failed result
      ], { useNative: true, enumName: 'type_payment_status' }).notNull()

      t.foreign('uid').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
      t.foreign('cid').references('id').inTable('conferences').onDelete('CASCADE').onUpdate('CASCADE')
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable('payments')
    .raw('DROP TYPE "type_payment_status"')
}
