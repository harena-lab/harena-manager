'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseArtifactsSchema extends Schema {
  up () {
    this.dropIfExists('case_artifacts')

    this.create('case_artifacts', (table) => {
      table.uuid('case_id').references('id').inTable('cases').index('case_id')
      table.uuid('artifact_id').references('id').inTable('artifacts').index('artifact_id')

      table.primary(['case_id', 'artifact_id'])

      table.timestamps()
    })
  }

  down () {
    this.drop('case_artifacts')
  }
}

module.exports = CaseArtifactsSchema
