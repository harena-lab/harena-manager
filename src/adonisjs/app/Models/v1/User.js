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

  // cases () {
  //   return this.belongsToMany('App/Models/v1/Case')
  //     .pivotTable('users_cases')
  //     .withPivot(['permission'])
  //     .withTimestamps()
  // }

  groups () {
    return this
      .belongsToMany('App/Models/Group')
      .pivotTable('users_groups')
      .withTimestamps()
  }

  artifacts () {
    return this.hasMany('App/Models/v1/Artifact')
  }

  institution () {
    return this.belongsTo('App/Models/v1/Institution')
  }

  roles () {
    return this.belongsToMany('App/Models/v1/Role')
      .pivotTable('role_user')
      .withTimestamps()
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  static get hidden () {
    return ['password']
  }


  async checkRole (role) {
    const query_result = await Database
      .from('roles')
      .where('roles.slug', role)
      .leftJoin('role_user', 'roles.id', 'role_user.role_id')
      .where('role_user.user_id', this.id)
      .count()

    if (query_result[0]['count(*)'] === 0) { return false } else { return true }
  }


  async checkCasePermission(caseId, permission) {
    let queryResult
    if (permission == 'share'){
      queryResult = await Database
        .from('users_cases')
        .where('users_cases.user_id', this.id)
        .where('users_cases.case_id', caseId)
        .whereIn('users_cases.permission', ['share', 'write', 'delete'])
        .count()
    }

    if (queryResult[0]['count(*)'] === 0) { return false } else { return true }
  }


  static boot () {
    super.boot()

    /**
         * A hook to hash the user password before saving
         * it to the database.
         */
    this.addHook('beforeCreate', 'UserHook.hashPassword')
    this.addHook('beforeSave', 'UserHook.hashPassword')

  }

  // Attach role and permissions of a user
  static get traits () {
    return [
      '@provider:Adonis/Acl/HasRole'
    ]
  }
}

module.exports = User
