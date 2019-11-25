'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersQuestsSchema extends Schema {
  up () {
    this.dropIfExists('user_quests')
    this.create('users_quests', (table) => {

      table.integer('user_id').unsigned().index('user_id')

      table.uuid('quest_id').references('id').inTable('quests').index('quests_id');
      table.foreign('user_id').references('users.id').onDelete('cascade')

      table.primary(['user_id', 'quest_id'])

      table.timestamps()
    })
  }

  down () {
    this.drop('users_quests')
  }
}

module.exports = UsersQuestsSchema
