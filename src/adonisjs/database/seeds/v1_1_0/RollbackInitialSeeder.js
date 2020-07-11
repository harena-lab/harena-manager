'use strict'

/*
|--------------------------------------------------------------------------
| RollbackInitialSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const CaseVersion = use('App/Models/v1/CaseVersion');
const Case = use('App/Models/v1/Case');
const User = use('App/Models/v1/User');

const Database = use('Database')

class RollbackInitialSeeder {
  async run () {
  	
  	let trx = await Database.beginTransaction()
  	
  	try{
		// await Permission.query().where('slug', 'admin_permissions').delete()
		// await Permission.query().where('slug', 'author_permissions').delete()
		// await Permission.query().where('slug', 'player_permissions').delete()

		// await Role.query().where('slug', 'admin').delete()
		// await Role.query().where('slug', 'author').delete()
		// await Role.query().where('slug', 'player').delete()


		// let ons = await c.versions().fetch()
  //     let cvs = versions.rows

  //     for (let i = 0; i < cvs.length; i++) {
  //       let cv = await CaseVersion.findBy('id', cvs[i].id)
  //       cv.delete()
  //     }

  //     c.delete()




		await Case.query().where('title', 'default-case').delete()

  		// await User.query().where('username', 'jacinto').delete()




      // let jacinto = await User.findBy('username', 'jacinto')

      // if (jacinto == null){

      //   let user = await this.seed_default_users(trx)
      //   await this.seed_default_case(user, trx)

      //   // user = await User.findBy('username', 'jacinto')

      //   await this.seed_roles_and_permissions(user, trx)
      //   trx.commit()

      // } else {
      //   console.log('Database is already populated')
      //   trx.commit()
      // }
    } catch(e){
      console.log('Error on seed process. Transactions rolled back. Log:')
      console.log(e)

      trx.rollback()
    }
  }
}

module.exports = RollbackInitialSeeder
