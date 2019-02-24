'use strict'

const Env = use('Env')
const User = use('App/Models/User')

class UserController {

  async login ({ auth, request }) {
    const { email, password } = request.all()
    await auth.attempt(email, password)

    return 'Logged in successfully'
  }

  show ({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return "You cannot see someone else's profile"
    }
    return auth.user
  }  

  async check({request, auth}) {

    const user = await auth.getUser()
    return {
      user: user.username,
      email: user.email,
      allowed_modules: ['describe', 'select', 'summary']
    }

  }

  async tokenCreate({request, response, auth}) {

    try {
      auth.authenticator('basic').check()

      // Saving user, getting instance back and generating api token
      const user = await auth.authenticator('basic').getUser()
      const apiToken = await auth.generate(user)

      return "" + apiToken['type'] + " " + apiToken['token']
    } catch (error) {
      response.status(401).send('You are not logged in')
    }

  }

}

module.exports = UserController
