exports.up = function(knex) {
  return knex.schema
    .createTable('papers', function(t) {
      t.increments('id').primary()
      t.string('title').notNull()
      t.integer('submitter_id').unsigned().notNull()
      t.integer('presenter_id').unsigned().notNull()
      t.integer('cid').unsigned().notNull()

      t.dateTime('date_submitted').notNull()
      t.enum('status',
             [ 'submitted', 'in_review', 'await_final_draft', 'published' ],
             { useNative: true, enumName: 'type_paper_status' })
       .notNull()

      t.foreign('submitter_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
      t.foreign('presenter_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
      t.foreign('cid').references('id').inTable('conferences').onDelete('CASCADE').onUpdate('CASCADE')
    })
    .createTable('binaries', function(t) {
      t.increments('id').primary()
      t.string('name').notNull()
      t.string('mime_type').notNull()
      t.binary('object').notNull()
    })
    .createTable('paper_revisions', function(t) {
      t.increments('revision_id').primary()
      t.integer('paper_revision').unsigned().notNull()
      t.string('abstract').notNull()
      t.integer('upload_id').unsigned()
      t.integer('paper_id').unsigned().notNull()

      t.foreign('upload_id').references('id').inTable('binaries').onDelete('CASCADE').onUpdate('CASCADE')
      t.foreign('paper_id').references('id').inTable('papers').onDelete('CASCADE').onUpdate('CASCADE')
      t.unique(['paper_revision', 'paper_id'])
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable('paper_revisions')
    .dropTable('binaries')
    .dropTable('papers')
    .raw('DROP TYPE "type_paper_status"')
}
