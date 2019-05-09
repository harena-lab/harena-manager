'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const uuidv4 = require('uuid/v4');

class CaseVersion extends Model {
    case() {
        return this.belongsTo('App/Models/v1/Case');
    }

    executions(){
        return this.belongsToMany('App/Models/v1/User').pivotTable('executions').withTimestamps()
    }

    static boot() {
        super.boot()

        /** A hook to hash the user password before saving it to the database.*/
        this.addHook('beforeSave', async (userInstance) => {
            userInstance.uuid = await uuidv4()
        })
    }
}

module.exports = CaseVersion