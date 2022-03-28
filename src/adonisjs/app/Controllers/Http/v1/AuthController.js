'use strict'

const Logger = use('Logger')

const User = use('App/Models/v1/User')
const Institution = use('App/Models/v1/Institution')
const Event = use('App/Models/v1/Event')

class AuthController {
  async checkToken ({ request, auth, response }) {
    try {
      // console.log('====Checking token...')
      if(await auth.check()){
        let userInstitution = await Institution.findBy('id', auth.user.institution_id)
        response.json({
          token: 'token valid',
          userId: auth.user.id,
          username: auth.user.username,
          grade: auth.user.grade,
          institution: userInstitution.acronym,
          institutionId: auth.user.institution_id})
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

  async loginEvent ({ request, auth, response, session }) {
    Logger.info('login attempt via v1/auth/loginEvent (SESSION)')
    let eventRel = null
    const event_id = request.input('eventId')
    if (event_id != null)
      eventRel = await Event.find(event_id)

    if (eventRel != null) {
      const username = request.input('username')
      const login = request.input('login')
      let user = null
      try {
        if (username != null)
          user = await User.findBy('username', username)
        else if (login != null)
          user = await User.findBy('login', login)

        if (user != null) {
          const roles = (await user.roles().fetch()).toJSON()
          for (const r of roles) {
            if (r.slug == 'admin')
              return response.status(500).json({
                type: 'unauthorized',
                message: 'Not authorized role login'})
          }
          if (await auth.remember(true).login(user)) {}
            return response.json({user: user, response: 'Login successful'})
        } else if (username != null)
          return response.status(200).json({response: 'Nome incorreto'})
        else
          return response.status(200).json({response: 'Login incorrect'})
      } catch (e) {
        if (e.code === 'E_CANNOT_LOGIN') {
          try {
            // console.log('=============== Another was session found, logging out old session')
            await auth.logout()
            if (await auth.remember(true).login(user)) {}
              return response.json({user: user, response: 'Login successful'})
          } catch (e) {
            console.log(e)
          }
        }
        return response.status(e.status).json({ message: e.message })
      }
    } else {
      return response.status(500).json({
        type: 'unauthorized',
        message: 'Not authorized login'})
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
