'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const Database = use('Database')

class User extends Model {
    static get incrementing () {
        return false
    }

    cases(){
        return this.belongsToMany('App/Models/v1/Case')
            .pivotTable('users_cases')
            .withPivot(['role'])
            .withTimestamps()
    }

    quests() {
        return this
            .belongsToMany('App/Models/v1/Quest')
            .pivotTable('quests_users')
            .withPivot(['role'])
            .withTimestamps()
    }

    artifacts() {
        return this.hasMany('App/Models/v1/Artifact')
    }

    institution(){
        return this.belongsTo('App/Models/v1/Institution')
    }

    roles(){
        return this.belongsToMany('App/Models/v1/Role')
            .pivotTable('role_user')
            .withTimestamps()
    }

    tokens() {
        return this.hasMany('App/Models/Token')
    }

    static get hidden () {
        return ['password']
    }

    async check_role(role) {
        let query_result = await Database
            .from('roles')
            .where('roles.slug', role)
            .leftJoin('role_user', 'roles.id', 'role_user.role_id')
            .where('role_user.user_id', this.id)
            .count()

        if (query_result[0]['count(*)'] === 0)
            return 0
        else
            return 1
    }

    static boot() {
        super.boot()

        /**
         * A hook to hash the user password before saving
         * it to the database.
         */
        this.addHook('beforeCreate', 'UserHook.hashPassword')
    }


    // Attach role and permissions of a user
    static get traits () {
        return [
            '@provider:Adonis/Acl/HasRole',
            '@provider:Adonis/Acl/HasPermission'
        ]
    }
}

module.exports = User
