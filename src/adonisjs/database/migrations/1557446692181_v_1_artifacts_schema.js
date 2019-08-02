'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArtifactsSchema extends Schema {

  up () {

    this.create('artifacts', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.uuid(   'case_id').references('uuid').inTable('cases');
      table.string( 'fs_path',         300).notNullable()
      table.string( 'relative_path',   300).notNullable()
      table.timestamps()
    })
  }

  down () {
  	
    this.drop('artifacts')
  }
}

module.exports = ArtifactsSchema
