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
    password: await Hash.make(faker.password()),
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

Factory.blueprint('Adonis/Acl/Role', (faker, i, data = {}) => {
  data = Object.assign({
    name: 'Administrator' || data.name,
    slug: 'administrator' || data.slug,
    description: 'manage administration privileges' || data.description
  }, data)
  return data
})

Factory.blueprint('Adonis/Acl/Permission', (faker, i, data = {}) => {
  data = Object.assign({
    name: data.name,
    slug: data.slug,
    description: data.description
  }, data)
  return data
})