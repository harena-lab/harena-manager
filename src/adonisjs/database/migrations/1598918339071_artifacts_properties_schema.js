'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArtifactsPropertiesSchema extends Schema {
  up () {
    this.dropIfExists('artifacts_properties')

    this.create('artifacts_properties', (table) => {
      table.uuid('artifact_id').references('id').inTable('artifacts').index('artifact_id');
      table.uuid('property_id').references('id').inTable('properties').index('property_id');
      table.primary(['artifact_id', 'property_id'])

      table.string('value')

      table.timestamps()
    })
  }

  down () {
    this.drop('artifacts_properties')
  }
}

module.exports = ArtifactsPropertiesSchema
