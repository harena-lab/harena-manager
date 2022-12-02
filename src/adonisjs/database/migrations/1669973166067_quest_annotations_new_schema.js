'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestAnnotationsSchema extends Schema {
  up () {
    this.create('quest_annotations', (table) => {
      table.uuid('quest_id').references('id').inTable('quests').index('quest_id')
      table.uuid('property_id').references('id').inTable('properties').index('property_id')
      table.uuid('user_id').references('id').inTable('users').index('user_id')
      table.string('fragment', 255)
      table.primary(['quest_id', 'property_id', 'user_id', 'fragment'])

      table.integer('count')
    })
  }

  down () {
    this.drop('quest_annotations')
  }
}

module.exports = QuestAnnotationsSchema
