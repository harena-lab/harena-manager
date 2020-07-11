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

    contributors(){
        return this.belongsToMany('App/Models/v1/User')
            .pivotTable('case_contributors')
            .withPivot(['role'])
            .withTimestamps()
    }

    quests () {
        return this
            .belongsToMany('App/Models/v1/Quest')
            .pivotTable('quests_cases')
            .withPivot(['argument'])
            .withTimestamps()
    }
} 

module.exports = Case
