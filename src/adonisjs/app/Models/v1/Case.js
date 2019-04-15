'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Case extends Model {
    user() {
        return this.belongsTo('App/Models/v1/User');
    }

    executions(){
        return this.belongsToMany('App/Models/v1/User').pivotTable('executions')
    }
} 

module.exports = Case
