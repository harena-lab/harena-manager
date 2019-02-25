'use strict'

const Env = use('Env')
const User = use('App/Models/User')

class AuthController {

  async login({auth, request}) {
    const {email, password} = request.all()
    console.log(email, password)
    await auth.attempt(email, password)

    return 'Logged in successfully'
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

      await auth.authenticator('basic').check() // header: Authorization='Basic base64encode(email:password)' e.g.: Basic jacinto@jacinto.com:jacinto = Basic amFjaW50b0BqYWNpbnRvLmNvbTpqYWNpbnRv

      const user = await auth.authenticator('basic').getUser()
      const newToken = await auth.generate(user)

      delete newToken.refreshToken 
      response.json(newToken)
      newToken['formatted_token'] = "Bearer " + newToken['token']


    } catch (error) {
      response.status(401).send('You are not logged in')
    }

  }


}

module.exports = AuthController