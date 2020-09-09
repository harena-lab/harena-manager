'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestCaseSchema extends Schema {
  up () {
    this.dropIfExists('quests_cases')

    this.create('quests_cases', (table) => {
      table.uuid('quest_id').references('id').inTable('quests').index('quest_id')
      table.uuid('case_id').references('id').inTable('cases').index('case_id')
      table.primary(['case_id', 'quest_id'])

      table.integer('order_position')

      table.timestamps()
    })
  }

  down () {
    this.drop('quests_cases')
  }
}

module.exports = QuestCaseSchema
