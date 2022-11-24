'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestAnnotationsSchema extends Schema {
  up () {
    this.create('quest_annotations', (table) => {
      table.uuid('user_id').references('id').inTable('users').index('user_id')
      table.uuid('quest_id').references('id').inTable('quests').index('quest_id')
      table.uuid('property_id').references('id').inTable('properties').index('property_id')
      table.string('value', 255)
      table.primary(['user_id', 'quest_id', 'property_id', 'value'])

      table.integer('count')
    })
  }

  down () {
    this.drop('quest_annotations')
  }
}

module.exports = QuestAnnotationsSchema
