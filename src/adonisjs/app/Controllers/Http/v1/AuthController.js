'use strict'

const Logger = use('Logger')

const User = use('App/Models/v1/User')

class AuthController {
  async checkToken ({ request, auth, response }) {
    try {
      // console.log('====Checking token...')
      if(await auth.check()){
        response.json({token:'token valid', username: auth.user.username})
      }
      // console.log('====Token valid')
    } catch (error) {
      // console.log('====Token invalid')
    }
  }

  async login ({ request, auth, response, session }) {
    Logger.info('login attempt via v1/auth/login (SESSION)')
    const { email, password } = request.all()
    try {
      if (await auth.remember(true).attempt(email, password)) {
        const user = await User.findBy('email', email)

        return response.json({user: user, response: 'Login successful'})
      }
    } catch (e) {
      if (e.code === 'E_CANNOT_LOGIN') {
        try {
          // console.log('=============== Another was session found, logging out old session')
          await auth.logout()
          if (await auth.remember(true).attempt(email, password)) {
            const user = await User.findBy('email', email)
            return response.json(user)
          }
        } catch (e) {
          console.log(e)
        }
      }else if(e.code === 'E_PASSWORD_MISMATCH' || e.code === 'E_USER_NOT_FOUND'){

        return response.status(200).json({response: 'Email or password incorrect'})
      }
      return response.status(e.status).json({ message: e.message })
    }
  }

  async logout ({ auth, response }) {
    try {
      await auth.logout()

      return response.json('Logged out successfuly')
    } catch (e) {
      console.log(e)
      return response.status(500).json(e.message)
    }
  }
}

module.exports = AuthController
