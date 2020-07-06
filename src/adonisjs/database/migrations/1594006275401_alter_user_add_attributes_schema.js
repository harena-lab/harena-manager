'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterUserAddAttributesSchema extends Schema {
  up () {
    this.table('users', (table) => {

      table.uuid('institution_id').references('id').inTable('institutions').index('institution_id');
      table.uuid('course_id').references('id').inTable('courses').index('course_id');

    })
  }

  down () {
    this.table('users', (table) => {

      table.dropColumn('institution_id')    
      table.dropColumn('course_id')    
    
    })
  }
}

module.exports = AlterUserAddAttributesSchema
