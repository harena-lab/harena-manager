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
    
    // copy the player and its scripts to the case
      let indexFile = fs.readFileSync(PLAYER_DIR + 'index.html', "utf8")
      let htmlFile = await Factory.model('App/Models/v1/HtmlFile').make({ name: 'index.html', content: indexFile })
    
      let jsPlayerFiles = fs.readdirSync(PLAYER_DIR + "js")
    
      for (let j = 0; j < jsPlayerFiles.length; j++) {
        let js = await Factory.model('App/Models/v1/JavaScript').make({ name: jsPlayerFiles[j], content: fs.readFileSync(PLAYER_DIR + "js/" + jsPlayerFiles[j], 'utf8') })
        await c.javascripts().save(js)
      }
    
      await c.htmlFiles().save(htmlFile)
    await c.versions().save(cv)
    await user.cases().save(c)
    
    
    // copy bus scripts to the case 
      let jsInfraFiles = fs.readdirSync(INFRA_DIR)
    
      jsInfraFiles = jsInfraFiles.filter(function(file) {
        return path.extname(file).toLowerCase() === ".js";
      });
    
      for (let j = 0; j < jsInfraFiles.length; j++) {
        let js = await Factory.model('App/Models/v1/JavaScript').make({ name: jsInfraFiles[j], content: fs.readFileSync(INFRA_DIR + jsInfraFiles[j], 'utf8') })
        await c.javascripts().save(js)
      }

    await Factory.model('App/Models/v1/User').createMany(5)
  }
}

module.exports = UserSeeder
