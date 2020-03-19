'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestSchema extends Schema {
  up () {
    this.dropIfExists('quests')

    this.create('quests', (table) => {
      table.uuid('id')
      table.primary('id')

      table.string('name', 255).notNullable().unique()

      table.uuid('author_id').references('id').inTable('users').index('author_id');

      table.timestamps()
    })
  }

  down () {
    this.drop('quests')
  }
}

module.exports = QuestSchema
