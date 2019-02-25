'use strict'

const Factory = use('Factory')
const Database = use('Database')
const User = use('App/Models/User')
const Auth = use('Adonis/Src/Auth')
const Config = use('Adonis/Src/Config')
const Env = use('Env')


class UserSeeder {
  async run () {
    const users = await Database.table('users')
    console.log(users)
	const userData = {username:"jacinto", password:"jacinto", email:"jacinto@jacinto.com"}
	const user = await User.create(userData)
	// make token
	const auth = new Auth({}, Config)
	const token = await auth.authenticator('api').generate(user)
	console.log('Created test user + token = ', token)

  }
}

module.exports = UserSeeder