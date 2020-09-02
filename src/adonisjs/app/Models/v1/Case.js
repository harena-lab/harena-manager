'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Case extends Model {
    static get incrementing () {
        return false
    }

    versions(){
        return this.hasMany('App/Models/v1/CaseVersion')
    }

    artifacts() {
        return this.hasMany('App/Models/CaseArtifact')
    }

    users(){
        return this.belongsToMany('App/Models/v1/User')
            .pivotTable('users_cases')
            .withPivot(['role'])
            .withTimestamps()
    }

    quests () {
        return this
            .belongsToMany('App/Models/v1/Quest')
            .pivotTable('quests_cases')
            .withPivot(['order_position'])
            .withTimestamps()
    }
} 

module.exports = Case
