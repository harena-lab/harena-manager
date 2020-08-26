'use strict'

const Hash = use('Hash')

const UserHook = exports = module.exports = {}

UserHook.hashPassword = async (user) => {
	// user.password = await Hash.make(user.password)
	console.log('-----------------'+ await Hash.make(user.password))
}
