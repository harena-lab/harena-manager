'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoleQuestSchema extends Schema {
  up () {
    this.dropIfExists('role_quests')

    this.create('role_quests', (table) => {
      table.uuid('quest_id').references('id').inTable('quests').index('quest_id');
      table.uuid('role_id').references('id').inTable('roles').index('role_id');
      table.primary(['quest_id', 'role_id'])


      table.timestamps()
    })
  }

  down () {
    this.drop('role_quests')
  }
}

module.exports = RoleQuestSchema
