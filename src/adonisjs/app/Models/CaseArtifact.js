'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CaseArtifact extends Model {
  artifact () {
    	return this.belongsTo('App/Models/v1/Artifact')
  }
}

module.exports = CaseArtifact
