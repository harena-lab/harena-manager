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
const uuidv4 = require('uuid/v4');


const User = use('App/Models/v1/User');
const Quest = use('App/Models/v1/Quest');

class UniversidadeDoMinhoRollbackSeeder {


  	async run () {
		let trx = await Database.beginTransaction()

		try{
			let emails = [{email: 'minho1@mail.com'}, {email: 'minho2@mail.com'}, {email: 'minho3@mail.com'}]
		
			let quest = new Quest()
    	 	quest.title = 'Decisões Extremas'
     		quest.id =  await uuidv4()
			await quest.save(trx)

		    let users = await Factory.model('App/Models/v1/User').createMany(3, emails, trx)

	    	for (var i = 0; i < users.length; i++) {

				await quest.users().attach(users[i].id, (row) => {
		        	const PLAYER = 2
	    	    	row.role = PLAYER
	      		}, trx)

	    	}

		    trx.commit()
		}catch(e){
		    trx.rollback()

			console.log('Error on seed process. Transactions rolled back. Log:')
      		console.log(e)
		}

  	}
}

module.exports = UniversidadeDoMinhoRollbackSeeder
