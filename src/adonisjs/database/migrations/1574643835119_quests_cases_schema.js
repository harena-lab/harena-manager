'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestsCasesSchema extends Schema {
  up () {
    this.dropIfExists('quests_cases')

    this.create('quests_cases', (table) => {

      table.uuid('quest_id').references('id').inTable('quests').index('quest_id');
      table.uuid('case_id').references('id').inTable('cases').index('case_id');

      table.string('argument')

      table.primary(['case_id', 'quest_id'])


      table.timestamps()
    })
  }

  down () {
    this.drop('quests_cases')
  }
}

module.exports = QuestsCasesSchema
