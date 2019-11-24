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

					Route.post(  'execution',       'v1/UserController.newExecution')
					Route.get(   ':id/execution',   'v1/UserController.listExecutions')

					Route.post(  'enable_case',				'v1/CaseController.enable_case')
					Route.get(   ':id/available_cases',   	'v1/UserController.available_cases')

}).prefix('/api/v1/user').middleware('auth')




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
	Route.post(  ':id/executions',      'v1/UserController.newExecution')   
	Route.get(   ':id/executions',      'v1/UserController.listExecutions') 
	
}).prefix('/api/v1/case').middleware('auth')



/*
|----------------------------------------------------------------------------------------------
|       api: v1                                                   
|  resource: /execution
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
	
	Route.get(   '',                    'v1/ExecutionController.index') 
	Route.get(   ':id',                 'v1/ExecutionController.index') 
	Route.put(   ':id',                 'v1/ExecutionController.update')
	Route.delete(':id',                 'v1/ExecutionController.destroy')
	
}).prefix('/api/v1/execution/').middleware('auth')


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
    Route.put(   ':id',             'v1/QuestController.update')

    Route.get(   '',                'v1/UserController.index')
    Route.get(   ':id',             'v1/UserController.show')
    Route.delete(':id',             'v1/UserController.destroy')

    Route.post(  'execution',       'v1/UserController.newExecution')
    Route.get(   ':id/execution',   'v1/UserController.listExecutions')

    Route.post(  'enable_case',				'v1/CaseController.enable_case')
    Route.get(   ':id/available_cases',   	'v1/UserController.available_cases')

}).prefix('/api/v1/user').middleware('auth')
