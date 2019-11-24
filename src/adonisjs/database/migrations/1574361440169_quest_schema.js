'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestSchema extends Schema {
  async up () {
    this.create('quests', (table) => {
      table.uuid('uuid')
      table.string('name', 255).notNullable()

      table.primary('uuid')

      table.timestamps()
    })


  }

  down () {
    this.dropIfExists('quests')
  }
}

module.exports = QuestSchema
