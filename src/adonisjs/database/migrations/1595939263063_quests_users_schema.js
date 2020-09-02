'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestsUsersSchema extends Schema {
  up () {
    this.dropIfExists('quests_users')

    this.create('quests_users', (table) => {
      table.uuid('user_id').references('id').inTable('users').index('user_id');
      table.uuid('quest_id').references('id').inTable('quests').index('quest_id');
      table.integer('role')

      table.primary(['quest_id', 'user_id', 'role'])

      table.timestamps()
    })
  }

  down () {
    this.drop('quests_users')
  }
}

module.exports = QuestsUsersSchema
