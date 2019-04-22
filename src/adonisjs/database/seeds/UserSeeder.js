'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const User = use('App/Models/v1/User');
const JavaScript = use('App/Models/v1/JavaScript');

const RESOURCE_DIR = "resources/"

const INFRA_DIR = "../../infra/"
const PLAYER_DIR = "../../player/"

const fs = require('fs');
const path = require('path');

class UserSeeder {
  async run() {
    let user = await User.create({  username: 'jacinto', 
                                    email: 'jacinto@example.com', 
                                    password: 'jacinto'})

    const c = await Factory.model('App/Models/v1/Case').make({ name: 'Case1' })

    const cv = await Factory.model('App/Models/v1/CaseVersion').make({ md: fs.readFileSync(RESOURCE_DIR + 'case.md', 'utf8') })
    await c.versions().save(cv)
    await user.cases().save(c)

    await Factory.model('App/Models/v1/User').createMany(5)


    
    let indexFile = fs.readFileSync(PLAYER_DIR + 'index.html', "utf8")
    await Factory.model('App/Models/v1/HtmlFile').create({ name: 'index.html', content: indexFile })



    let infraFiles = fs.readdirSync(INFRA_DIR)

    var jsFiles = infraFiles.filter(function(file) {
      return path.extname(file).toLowerCase() === ".js";
    });

    let jss = []

    jsFiles.forEach(file => {
      jss.push({name: file, content: fs.readFileSync(INFRA_DIR + file, 'utf8') })
    });

    await Factory.model('App/Models/v1/JavaScript').createMany(jss.length, jss)
  }
}

module.exports = UserSeeder
