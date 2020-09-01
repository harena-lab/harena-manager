'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArtifactUpdateAddPropertyAndQuestRelationshipsSchema extends Schema {
  up () {
    this.table('artifacts', (table) => {
      table.uuid('quest_id').references('id').inTable('quests').index('quest_id')
    })
  }

  down () {
    this.table('artifacts', (table) => {
      table.dropForeign('quest_id')
      table.dropColumn('quest_id')
    })
  }
}

module.exports = ArtifactUpdateAddPropertyAndQuestRelationshipsSchema
