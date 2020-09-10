'use strict'

/*
|--------------------------------------------------------------------------
| UniversidadeDoMinhoSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Database = use('Database')
const uuidv4 = require('uuid/v4')

const User = use('App/Models/v1/User')
const Quest = use('App/Models/v1/Quest')
const Case = use('App/Models/v1/Case')

const Role = use('App/Models/v1/Role')
const Permission = use('App/Models/v1/Permission')

class UniversidadeDoMinhoSeeder {
  	async run () {
    const trx = await Database.beginTransaction()

    try {
      const emails = [{ email: 'minho1@mail.com' }, { email: 'minho2@mail.com' }, { email: 'minho3@mail.com' }]

      const quest = new Quest()
    	 	quest.title = 'Decisões Extremas'
     		quest.id = await uuidv4()
      await quest.save(trx)

		    const users = await Factory.model('App/Models/v1/User').createMany(3, emails, trx)

      const role_player = await Role.findBy('slug', 'player')

	    	for (var i = 0; i < users.length; i++) {
        await quest.users().attach(users[i].id, (row) => {
		        	const PLAYER = 2
	    	    	row.role = PLAYER
	      		}, trx)

        await users[i].roles().attach([role_player.id], trx)
	    	}

      const c = await Case.findBy('title', 'default-case')
      await quest.cases().attach(c.id, (row) => {
        row.order_position = 0
      }, trx)

		    trx.commit()
    } catch (e) {
		    trx.rollback()

      console.log('Error on seed process. Transactions rolled back. Log:')
      		console.log(e)
    }
  	}
}

module.exports = UniversidadeDoMinhoSeeder
