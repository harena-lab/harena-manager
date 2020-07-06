'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserPropertySchema extends Schema {
  up () {

	this.dropIfExists('user_properties')

    this.create('user_properties', (table) => {
      table.uuid('user_id').references('id').inTable('users').index('user_id');
      table.uuid('property_id').references('id').inTable('properties').index('property_id');
      table.primary(['user_id', 'property_id'])    
	  table.string('value', 255)

      table.timestamps()
  
    })
  }

  down () {
    this.drop('user_properties')
  }
}

module.exports = UserPropertySchema
