'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

const Environment = use('App/Models/Environment')


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

  environments () {
    return this
      .belongsToMany('App/Models/Environment')
      .pivotTable('users_environments')
      .withTimestamps()
  }

  environment () {
    return this.belongsTo('App/Models/Environment')
  }
  //  environment () {
  //   return this.belongsTo('App/Models/Environment')
  // }
  // environment () {
  //   return this
  //     .belongsToMany('App/Models/Group')
  //     .pivotTable('users_groups')
  //     .withTimestamps()
  // }

//   async environment (){
//     let queryResult = await Database
//       .from('environments')
//       .leftJoin('users', 'users.environment_id', 'environments.id')
//       .where('users.id', this.id)
//       // .where('users_environments.environment_id', caseId)
//       // .whereIn('users_cases.permission', ['share', 'write', 'delete'])
//       // .count()
//       queryResult
//       const result = JSON.stringify(queryResult)
//       // console.log(queryResult[0]['id'])
//       // console.log(queryResult[0]['name'])
//
//       // for (var r in result) {
//       //   console.log(r)
//       //
//       // }
//       // result.forEach((item, i) => {
//       //   console.log(r)
//       // });
// console.log('result '+result)
//       if (result.length==0){
//         console.log('aquiiiiiiiiiiiiiii')
//         // let environment
//         // environment.name = 'public'
//         return 'unicamp'
//       }
//       console.log(queryResult)
//         if (queryResult[0]['count(*)'] === 0) {
//           return response.status(500).json('you dont have permission to ' + properties[0] + ' such case')
//         } else {
//           const environment = new Environment()
//           // environment.
//           const environmet = Environment
//           // console.log(result[0])
//           return queryResult[0]['name']
//           // await next()
//         }
//         return queryResult
//
//   }

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
