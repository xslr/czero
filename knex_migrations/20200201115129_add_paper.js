exports.up = function(knex) {
  return knex.schema
    .createTable('tblPaper', function(t) {
      t.increments('id').primary()
      t.string('title').notNull()
      t.integer('submitterId').unsigned().notNull()
      t.integer('presenterId').unsigned().notNull()
      t.integer('cid').unsigned().notNull()

      t.dateTime('dateSubmitted').notNull()
      t.enum('status',
             [ 'submitted', 'in_review', 'await_final_draft', 'published' ],
             { useNative: true, enumName: 'typePaperStatus' })
       .notNull()

      t.foreign('submitterId').references('id').inTable('tblUser').onDelete('CASCADE').onUpdate('CASCADE')
      t.foreign('presenterId').references('id').inTable('tblUser').onDelete('CASCADE').onUpdate('CASCADE')
      t.foreign('cid').references('id').inTable('tblConference').onDelete('CASCADE').onUpdate('CASCADE')
    })
    .createTable('tblBinaries', function(t) {
      t.increments('id').primary()
      t.string('name').notNull()
      t.string('mime_type').notNull()
      t.binary('object').notNull()
    })
    .createTable('tblPaperRevision', function(t) {
      t.integer('revisionNumber').unsigned().notNull()
      t.string('abstract').notNull()
      t.integer('uploadId').unsigned()
      t.integer('paperId').unsigned().notNull()

      t.foreign('uploadId').references('id').inTable('tblBinaries').onDelete('CASCADE').onUpdate('CASCADE')
      t.foreign('paperId').references('id').inTable('tblPaper').onDelete('CASCADE').onUpdate('CASCADE')
      t.primary(['revisionNumber', 'paperId'])
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable('tblPaperRevision')
    .dropTable('tblBinaries')
    .dropTable('tblPaper')
    .raw('DROP TYPE "typePaperStatus"')
}
