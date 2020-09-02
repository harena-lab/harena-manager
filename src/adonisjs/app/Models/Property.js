'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Property extends Model {

	static get incrementing () {
        return false
    }


    artifacts() {
        return this
            .belongsToMany('App/Models/v1/Artifact')
            .pivotTable('artifacts_properties')
            .withPivot(['value'])
            .withTimestamps()
    }
}

module.exports = Property
