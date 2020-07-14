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
            
            let user = auth.user

            // const test = await User.query().where('id', user.id).with('tokens').fetch()
            // let testJSON = test.toJSON()

            let storedUser = await User.find(user.id)
//             console.log(storedUser)

//             // let token = await auth.authenticator('jwt').generate(user)

//             Object.assign(user, token)

//            // let token = await auth.authenticator('jwt').withRefreshToken().attempt(email, password)
//             let token = await auth.authenticator('jwt').generate(user)

//             let tokens = await storedUser.tokens().fetch()
//             let tokens_rows = tokens.rows

//             let stored_token = {}
//             for (let i = 0; i < tokens_rows.length; i++) {
//                 stored_token.token = tokens_rows[i].token
//             }

//             Object.assign(storedUser, stored_token)
            return response.json(storedUser)

        } catch (e){
            console.log(e)
            let payload = { message: 'an error ocurred on method login()', 
                            problem: e.message }

            return response.status(500).json(payload)

        }
    }

    async logout({ auth, response }) {
        try{
                        // let token = await auth.authenticator('jwt').generate(user)
            // await auth.check()

            const user = auth.user

            const token = auth.authenticator('jwt').getAuthHeader()

//             // let user = await User().findBy(user.email)
// console.log(user)
//             // await user.tokens().where('type', 'remember_token').update({ is_revoked:true })
            await auth.authenticator("jwt").revokeTokens([token])
// // auth.authenticator('jwt')
//             // console.log(await auth.authenticator('jwt').listTokens())
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
