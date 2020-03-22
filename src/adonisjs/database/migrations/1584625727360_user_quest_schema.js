'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserQuestSchema extends Schema {
  up () {
    this.dropIfExists('user_quests')

    this.create('user_quests', (table) => {
      table.uuid('user_id').references('id').inTable('users').index('users_id');
      table.uuid('quest_id').references('id').inTable('quests').index('quests_id');
      table.primary(['user_id', 'quest_id'])

      table.timestamps()
    })
  }

  down () {
    this.drop('user_quests')
  }
}

module.exports = UserQuestSchema
