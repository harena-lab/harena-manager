'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')

Factory.blueprint('App/Models/v1/User', async (faker, i, data) => {
  return {
    username:  faker.username(),
    email: faker.email(),
    password: await Hash.make(faker.password())
  }
})

Factory.blueprint('App/Models/v1/Case', (faker, i, data) => {
  return {
    name: data.name
  }
})

Factory.blueprint('App/Models/v1/CaseVersion', async (faker, i, data) => {
  return {
    source: data.source
  }
})