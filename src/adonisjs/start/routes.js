'use strict'


const Route   = use('Route')

/*
|----------------------------------------------------------------------------------------------
|  index                                                   
|----------------------------------------------------------------------------------------------
*/
Route.get('/', () => { return 'Hello from the harena-manager'} )


/* Test route */
Route.get('/api/imagetest', 	'TestController.index') 
Route.post('/', 				'TestController.create').as('profile');

/*
|----------------------------------------------------------------------------------------------
|       api: v1                                                   
|  resource: /user
|----------------------------------------------------------------------------------------------
*/
Route.post('/api/v1/user/register',                 'v1/UserController.store')
Route.post('/api/v1/user/login',                    'v1/AuthController.login') 
Route.group(() => { 
                    Route.get(   '',                'v1/UserController.index')
                    Route.get(   ':id',             'v1/UserController.show') 
                    Route.put(   ':id',             'v1/UserController.update')
                    Route.delete(':id',             'v1/UserController.destroy')
}).prefix('/api/v1/user').middleware(['auth', 'is:administrator'])




/*
|----------------------------------------------------------------------------------------------
|       api: v1                                                   
|  resource: /case
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
	
	Route.post( 'list',                 'v1/CaseController.index')  
	Route.get(  ':id',                  'v1/CaseController.show') 
	Route.post(  '',                    'v1/CaseController.store')
	Route.put(   ':id',                 'v1/CaseController.update')
	Route.delete(':id',                 'v1/CaseController.destroy')
	Route.post(  'new',                 'v1/CaseController.newCase')

}).prefix('/api/v1/case').middleware('auth:jwt')


/*
|----------------------------------------------------------------------------------------------
|       api: v1                                                   
|  resource: /artifacts
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
	
	Route.post(  '',                    'v1/ArtifactController.store')
	
}).prefix('/api/v1/artifact/').middleware('auth')

/*
|----------------------------------------------------------------------------------------------
|       api: v1
|  resource: /quest
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
    Route.put(   '',             	'v1/QuestController.store')
	Route.post(  'link/user',		'v1/QuestController.link_user')
	Route.post(  'link/case',		'v1/QuestController.link_case')
	Route.get(   ':id/list/users',      'v1/QuestController.list_users')
	Route.get(   ':id/list/cases',      'v1/QuestController.list_cases')


}).prefix('/api/v1/quest').middleware('auth', 'is:administrator')
