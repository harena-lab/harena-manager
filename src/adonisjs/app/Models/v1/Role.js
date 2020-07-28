'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Role extends Model {
    static get incrementing () {
        return false
    }

    permissions() {
        return this
            .belongsToMany('App/Models/v1/Permission')
            .pivotTable('permission_role')
            .withTimestamps()
    }

    // quests() {
    //     return this
    //         .belongsToMany('App/Models/v1/Quest')
    //         .pivotTable('quests_users')
    //         .withPivot(['role'])
    //         .withTimestamps()
    // }

    static get traits () {
        return [
            '@provider:Adonis/Acl/HasPermission'
        ]
    }
}

module.exports = Role
