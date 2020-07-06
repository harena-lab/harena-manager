'use strict'

const User = use('App/Models/User');

class AuthController {

	async login({ request, auth, response }) {
    let { email, password } = request.all();

    console.log('aqui')
    try {
      let a =await auth.check()
    } catch (error) {
      response.send('You are not logged in')
    }
    
    await auth.logout()
    
    try {
      if (await auth.remember(true).attempt(email, password)) {
        console.log(1)

        let user_instance = await User.findBy('email', email)
        let token = await auth.generate(user_instance)

        // await auth.loginViaId(user_instance.id)

        // const user = auth.user
        // auth = await auth.authenticator('jwt')
        // console.log(2)


        // let token = await auth.generate(user_instance)
               
        // let authenticatedUser = new User()
        // authenticatedUser.id = user.id
        // authenticatedUser.email = user.email
        // authenticatedUser.username = user.username
        // Object.assign(user_instance, token)

        return response.json(token)
      }
          
        }
        catch (e) {
            console.log(e)
            return response.status(e.status).json({ message: e })
        }
    }

}

module.exports = AuthController
