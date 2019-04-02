'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Route.on('/').render('welcome')

Route.get('/', () => { return 'Hello from the Harena\'s casemanager'} )

Route.group(() => {
	Route.put('/:id', 'v1/CaseController.update')
	Route.delete('/id', 'v1/CaseController.destroy')
	Route.post('', 'v1/CaseController.store')
	Route.get('', 'v1/CaseController.index') 
}).prefix('/api/v1/cases/').middleware('auth')

Route.post('/auth/register', 'AuthController.register')
Route.post('/auth/login', 'AuthController.login')






'use strict'

const User = use('App/Models/User');

class AuthController {
    async register({ request, auth, response }) {
        try {
            let user = await User.create(request.all())

            let token = await auth.generate(user)
            Object.assign(user, token)
            response.json(user)
        } catch(error){
            console.log(error)
            if (error.code === 'ER_DUP_ENTRY'){
                response.json({status : 409, message: 'This username is not available. Choose another one.' })
            }
        }
    }

    async login({ request, auth, response }) {
        let { email, password } = request.all();

        try {
            if (await auth.attempt(username, password)) {
                let user = await User.findBy('username', username)
                let token = await auth.generate(user)

                Object.assign(user, token)
                return response.json(user)
            }
        }
        catch (e) {
            console.log(e)
            return response.json({status : 401, message: 'You are not registered!' })
        }
    }

    /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ auth, params, request, response }) {
    try {
        await auth.check()

        let u = await User.find(params.id)
    
        u.email = request.input('email')
    
        await u.save()
        return response.json(u)
    } catch (error) {
        response.send(error.message)
    }
  }
}

module.exports = AuthController