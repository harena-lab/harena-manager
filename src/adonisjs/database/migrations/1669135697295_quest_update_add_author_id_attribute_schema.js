'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestUpdateAddAuthorIdAttributeSchema extends Schema {
  up () {
    this.table('quests', (table) => {
      table.uuid('author_id').references('id').inTable('users').index('author_id')
    })
  }

  down () {
    this.table('quests', (table) => {
      table.dropForeign('author_id')
      table.dropColumn('author_id')
    })
  }
}

module.exports = QuestUpdateAddAuthorIdAttributeSchema
