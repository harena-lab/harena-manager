'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArtifactUpdateAddPropertyAndQuestRelationshipsSchema extends Schema {
  up () {
    this.table('artifacts', (table) => {
      table.dropForeign('case_id')
      table.dropColumn('case_id')

      table.dropColumn('fs_path')
    })
  }

  down () {
    this.table('artifacts', (table) => {
      table.string('fs_path', 300).notNullable()

      table.uuid('case_id').references('id').inTable('cases').index('case_id')
    })
  }
}

module.exports = ArtifactUpdateAddPropertyAndQuestRelationshipsSchema
