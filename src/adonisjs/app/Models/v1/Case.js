'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const uuidv4 = require('uuid/v4');

class Case extends Model {
    static get incrementing () {
        return false
    }
    
    user() {
        return this.belongsTo('App/Models/v1/User');
    }

    versions(){
        return this.hasMany('App/Models/v1/CaseVersion')
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
