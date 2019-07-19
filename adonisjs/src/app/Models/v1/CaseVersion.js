'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CaseVersion extends Model {
    case() {
        return this.belongsTo('App/Models/v1/Case');
    }

    executions(){
        return this.belongsToMany('App/Models/v1/User').pivotTable('executions').withTimestamps()
    }
}

module.exports = CaseVersion