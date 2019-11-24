'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestsCasesSchema extends Schema {
  up () {
    this.create('quests_cases', (table) => {

      table.uuid('quests_uuid').references('uuid').inTable('quests').index('quests_uuid');
      table.uuid('cases_uuid').references('uuid').inTable('cases').index('cases_uuid');

      table.string('argument')

      table.primary(['cases_uuid', 'quests_uuid'])


      table.timestamps()
    })
  }

  down () {
    this.drop('quests_cases')
  }
}

module.exports = QuestsCasesSchema
