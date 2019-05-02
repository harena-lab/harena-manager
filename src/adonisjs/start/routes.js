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
| Architecture Documentation:     https://docs.google.com/presentation/d/1-8s0X-VuXF4b_vi8tbzYNCHU6UwYOUPa7KppUpevaNA/edit#slide=id.g4cba6f4dfb_0_108
| case-notebook previous mapping: https://github.com/datasci4health/case-notebook/blob/master/notebook/server/notebook-server-rest.ipynb
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Route.get('/', () => { return 'Hello from the Harena\'s casemanager'} )

const knot = { knot: ' asiudfhiuaqhsdf asiudf nasiudfa sdf' }

Route.get('/classic', ({ view }) => {
							  return view.render('themes/classic/dt', knot)
})

Route.get('/jacinto', ({ view }) => {
							  return view.render('themes/jacinto/dt', knot)
})

/* User CRUD */
Route.post('/api/v1/user/register', 'v1/UserController.store')
Route.post('/api/v1/user/login', 	'AuthController.login') 
Route.group(() => { 
					Route.get(   '',			   	'v1/UserController.index') 
					Route.get(   ':id',			   	'v1/UserController.show') 
					Route.put(   ':id',            	'v1/UserController.update')
					Route.delete(':id',            	'v1/UserController.destroy')

					Route.get(   ':id/execution', 	'v1/UserController.listExecutions') 
					Route.post(  'execution', 		'v1/UserController.newExecution') // input: case_id -> returns execution:{uuid}
}).prefix('/api/v1/user').middleware('auth')

/* 
	Case CRUD
*/
Route.group(() => {
			Route.post( 'list',            		'v1/CaseController.index') 	
			Route.get(	':id',   		'v1/CaseController.show')
 
			Route.post(  '',               		'v1/CaseController.store')
			Route.put(   ':id',            		'v1/CaseController.update')
			Route.delete(':id',            		'v1/CaseController.destroy')

			Route.post(  'new',            		'v1/CaseController.newCase')

			Route.post(  ':id/executions', 		'v1/UserController.newExecution')   // input: user_id -> returns execution:{uuid}
			Route.get(   ':id/executions', 		'v1/UserController.listExecutions') // input: user_id -> returns execution:{uuid}

			Route.post(  ':id/prepare-case-html',	'v1/CaseController.prepareCaseHTML')
}).prefix('/api/v1/case').middleware('auth')

/* 
	Execution CRUD
*/
Route.group(() => {
					Route.get(   '',       'v1/ExecutionController.index') // {filter:{ user_id: 14, case_id: 89}}
					Route.get(   ':id',    'v1/ExecutionController.index') 
					Route.put(   ':id',    'v1/ExecutionController.update')
					Route.delete(':id',    'v1/ExecutionController.destroy')
}).prefix('/api/v1/execution/').middleware('auth')

/* 
	Template CRUD 
*/
Route.group(() => {
					Route.get(   '',       'v1/TemplateController.index') 
}).prefix('/api/v1/template/').middleware('auth')

/* 
	Models CRUD
*/
Route.group(() => {
					Route.get(   '',    'v1/ModelController.index') 
}).prefix('/api/v1/models/').middleware('auth')

/* 
	KnotCapsule CRUD
*/
Route.group(() => {
				Route.get(   '',		'v1/KnotCapsuleController.index') 
				Route.post(  '',      	'v1/KnotCapsuleController.store')
}).prefix('/api/v1/knot/').middleware('auth')

/* 
	Auth  
*/
Route.group(() => {
}).prefix('/api/v1/auth')