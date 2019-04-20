'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Execution extends Model {
    static boot () {
        super.boot()
        this.addHook('beforeCreate', (executions) => {
            executions.is_current_owner = true
        })
    }
}

module.exports = Execution
