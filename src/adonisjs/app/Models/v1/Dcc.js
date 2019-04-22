'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Dcc extends Model {
    case(){
        return this.belongsTo('App/Models/v1/Case');
    }

    javascripts(){
        return this.hasMany('App/Models/v1/JavaScript')
    }
}

module.exports = Dcc
