'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DropUsersQuestsSchema extends Schema {
  up () {
    this.dropIfExists('quests_users')
  }

  down () {
    this.create('quests_users', (table) => {
      table.uuid('user_id').references('id').inTable('users').index('user_id')
      table.uuid('quest_id').references('id').inTable('quests').index('quest_id')
      table.integer('permission')

      table.primary(['quest_id', 'user_id', 'permission'])

      table.timestamps()
    })

  }
}

module.exports = DropUsersQuestsSchema
