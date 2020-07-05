'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterUserAddAttributesSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('username', 100)
      
      table.date('birth')
      table.string('gender', 100)
      table.string('expertise', 50)
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AlterUserAddAttributesSchema
