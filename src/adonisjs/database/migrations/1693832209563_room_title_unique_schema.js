'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoomTitleUniqueSchema extends Schema {
  up () {
    this.table('rooms', (table) => {
      table.string('title').unique().alter()
    })
  }

  down () {
    this.table('rooms', (table) => {
      table.string('title').dropUnique().alter()
    })
  }
}

module.exports = RoomTitleUniqueSchema
