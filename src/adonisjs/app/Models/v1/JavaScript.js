'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class JavaScript extends Model {
    case(){
        return this.belongsTo('App/Models/v1/Case');
    }
}

module.exports = JavaScript
