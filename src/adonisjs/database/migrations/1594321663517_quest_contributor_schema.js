'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestContributorSchema extends Schema {
  up () {

	this.dropIfExists('quest_contributors')

    this.create('quest_contributors', (table) => {
      table.uuid('user_id').references('id').inTable('users').index('user_id');
      table.uuid('quest_id').references('id').inTable('quests').index('quest_id');
      table.primary(['quest_id', 'user_id'])

      table.integer('role')

      table.timestamps()
    })
  }

  down () {
    this.drop('quest_contributors')
  }
}

module.exports = QuestContributorSchema
