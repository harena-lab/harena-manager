'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventsSchema extends Schema {
  up () {
    this.dropIfExists('events')

    this.create('events', (table) => {
      table.uuid('id')
      table.primary('id')

      table.string('title').notNullable()
      table.text('description')
      table.dateTime('start_at')
      table.dateTime('end_at')
      table.boolean('open')
      table.boolean('active')
      table.uuid('case_id').references('id').inTable('cases').index('case_id')
      table.uuid('quest_id').references('id').inTable('quests').index('quest_id')
      table.uuid('institution_id').references('id').inTable('institutions').index('institution_id')
      table.uuid('role_id').references('id').inTable('roles').index('role_id')
      table.uuid('group_id').references('id').inTable('groups').index('group_id')
      table.integer('participants_limit')
      table.integer('younger_age')
      table.integer('older_age')
      table.string('conference_address')
      table.string('term_id').references('id').inTable('terms').index('term_id')

      table.timestamps()
    })
  }

  down () {
    this.drop('events')
  }
}

module.exports = EventsSchema
