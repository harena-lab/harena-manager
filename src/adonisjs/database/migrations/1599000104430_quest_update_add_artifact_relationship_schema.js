'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestUpdateAddArtifactRelationshipSchema extends Schema {
  up () {
    this.table('quests', (table) => {
      // alter table
      table.uuid('artifact_id').references('id').inTable('artifacts').index('artifact_id');

    })
  }

  down () {
    this.table('quests', (table) => {
      // reverse alternations
      table.dropForeign('artifact_id')
      table.dropColumn('artifact_id')
    })
  }
}

module.exports = QuestUpdateAddArtifactRelationshipSchema
