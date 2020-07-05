'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestCaseSchema extends Schema {
  up () {
    this.dropIfExists('quest_cases')

    this.create('quest_cases', (table) => {
      table.uuid('quest_id').references('id').inTable('quests').index('quest_id');
      table.uuid('case_id').references('id').inTable('cases').index('case_id');
      table.primary(['case_id', 'quest_id'])

      table.string('argument')

      table.timestamps()
    })
  }

  down () {
    this.drop('quest_cases')
  }
}

module.exports = QuestCaseSchema
