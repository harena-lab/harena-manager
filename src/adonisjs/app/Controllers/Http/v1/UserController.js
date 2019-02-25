'use strict'

const Env = use('Env')
const User = use('App/Models/User')

class UserController {



  show ({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return "You cannot see someone else's profile"
    }
    return auth.user
  }




}

module.exports = UserController
