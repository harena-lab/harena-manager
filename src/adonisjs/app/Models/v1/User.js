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

    static async getAuthenticatedUser(email){
        return await Database.table('users').select('username', 'email').where('email', email)
    }

    // cases() {
    //     return this.hasMany('App/Models/v1/Case')
    // }

    cases(){
        return this.belongsToMany('App/Models/v1/Case')
            .pivotTable('contributors')
            .withPivot(['author'])
            .withTimestamps()
    }

    quests () {
        return this
            .belongsToMany('App/Models/v1/Quest')
            .pivotTable('users_quests')
            .withTimestamps()
    }

    artifacts() {
        return this.hasMany('App/Models/v1/Artifact')
    }

    static boot() {
        super.boot()

        /**
         * A hook to hash the user password before saving
         * it to the database.
         */
        this.addHook('beforeCreate', 'UserHook.hashPassword')
    }

    /**
     * A relationship on tokens is required for auth to
     * work. Since features like `refreshTokens` or
     * `rememberToken` will be saved inside the
     * tokens table.
     *
     * @method tokens
     *
     * @return {Object}
     */
    tokens() {
        return this.hasMany('App/Models/Token')
    }

    static get traits () {
        return [
            '@provider:Adonis/Acl/HasRole',
            '@provider:Adonis/Acl/HasPermission'
        ]
    }
}

module.exports = User
