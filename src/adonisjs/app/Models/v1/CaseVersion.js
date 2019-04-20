'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CaseVersion extends Model {
    static get primaryKey () {
        return 'id'
    }

    case() {
        return this.belongsTo('App/Models/v1/Case');
    }
}

module.exports = CaseVersion
