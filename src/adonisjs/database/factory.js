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

const uuidv4 = require('uuid/v4');


Factory.blueprint('App/Models/v1/User', async (faker, i, data) => {
  let username = faker.username()
  return {
    username:  username,
    login:  username,
    email: data[i].email,
    password: username,

    // password: faker.password(),
    id: await uuidv4()
  }
})

Factory.blueprint('App/Models/v1/Case', (faker, i, data) => {
  return {
    name: data.name,
    id: data.id
  }
})

Factory.blueprint('App/Models/v1/CaseVersion', async (faker, i, data) => {
  return {
    source: data.source,
    id: data.id
  }
})

Factory.blueprint('App/Models/v1/Role', async (faker, i, data ) => {
  return {
      name: data[i].name,
      slug: data[i].slug,
      description: data[i].description,

      // password: faker.password(),
      id: await uuidv4()
    }
})

  // data = Object.assign({
  //   name: 'Administrator' || data[i].name,
  //   slug: 'administrator' || data[i].slug,
  //   description: 'manage administration privileges' || data[i].description
  // }, data)
  // return data

Factory.blueprint('App/Models/v1/Permission', async (faker, i, data ) => {
  return {
    name: data[i].name,
    slug: data[i].slug,
    description: data[i].description,

      // password: faker.password(),
    id: await uuidv4()
  }
})