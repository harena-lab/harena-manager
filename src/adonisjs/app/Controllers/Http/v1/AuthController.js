'use strict'

const User = use('App/Models/v1/User');

class AuthController {
    async login({ request, auth, response }) {
        try {
            let { email, password } = request.all();

console.log(request)
            if (await auth.attempt(email, password)) {
                console.log('------------------------------- attempt')
                let user = await User.findBy('email', email)
                // let token = await auth.generate(user)
                
                // let authenticatedUser = new User()
                // authenticatedUser.id = user.id
                // authenticatedUser.email = user.email
                // authenticatedUser.username = user.username

                // Object.assign(authenticatedUser, token)
                // return response.json('Logged in successfully')
                return response.json(auth.user)

            }
        }
        catch (e) {
            console.log(e)
            return response.status(e.status).json({ message: e.message })
        }
    }

    async logout({ auth, response }) {
        try{

            await auth.logout()
            
            return response.json('Logged Zout successfuly')
        }catch(e){
            console.log(e)
            return response.status(500).json(e.message)
        }
        
    }
}

module.exports = AuthController