'use strict'

const User = use('App/Models/v1/User');

class AuthController {

	async login({ request, auth, response }) {
        try{
            const { email, password } = request.all();

            try{
                let logged = await auth.check()

                if (logged){
                    let user = await auth.getUser()
                    return response.json('already logged as user ' + user.username)
                }
    
            } catch(e){
                console.log('auth.check() - pass')
            }

            await auth.remember(true).attempt(email, password)
            
            console.log(1)

            let user = auth.user

            let token = await auth.authenticator('jwt').generate(user)
            console.log(token)

            Object.assign(user, token)


            return response.json(user)

        } catch (e){
            console.log(e)
            let payload = { message: 'an error ocurred on method login()', 
                            problem: e.message }

            return response.status(500).json(payload)

        }
        // await auth.logout()
    
        // try {
        //   if (await auth.remember(true).attempt(email, password)) {
        //     console.log(1)

        //     let user_instance = await User.findBy('email', email)
        //     let token = await auth.generate(user_instance)

        //     // await auth.loginViaId(user_instance.id)

        //     // const user = auth.user
        //     // auth = await auth.authenticator('jwt')
        //     // console.log(2)


        //     // let token = await auth.generate(user_instance)
                   
        //     // let authenticatedUser = new User()
        //     // authenticatedUser.id = user.id
        //     // authenticatedUser.email = user.email
        //     // authenticatedUser.username = user.username
        //     // Object.assign(user_instance, token)

        //     return response.json(token)
        //   }
          
        // }
        // catch (e) {
        //     console.log(e)
        //     return response.status(e.status).json({ message: e })
        // }
    }

    async logout({ auth, response }) {
        try{
                        // let token = await auth.authenticator('jwt').generate(user)
            // await auth.check()

            const user = auth.user
            // console.log(user)
            const token = auth.authenticator('jwt').getAuthHeader()
            console.log(token)

            // let user = await User().findBy(user.email)
console.log(user)
            await user.tokens().where('token', token).update({ is_revoked:true })
console.log(6)

auth.authenticator('jwt')
            // console.log(await auth.authenticator('jwt').listTokens())
            await auth.logout()
            return response.json('successfully logout')
        } catch(e){
            console.log(e)
            return response.status(500).json({ message: 'an error ocurred on method logout()', 
                                               problem: e.message })
        }
    }

}

module.exports = AuthController
