'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersQuestsSchema extends Schema {
  up () {
    this.create('users_quests', (table) => {

      table.integer('users_id').unsigned().index('users_id')

      table.uuid('quests_uuid').references('uuid').inTable('quests').index('quests_uuid');
      table.foreign('users_id').references('users.id').onDelete('cascade')

      table.primary(['users_id', 'quests_uuid'])

      table.timestamps()
    })
  }

  down () {
    this.drop('users_quests')
  }
}

module.exports = UsersQuestsSchema
