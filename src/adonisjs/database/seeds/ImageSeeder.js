'use strict'

/*
|--------------------------------------------------------------------------
| ImageSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const fs = require('fs');

const SHARED_IMAGES_DIR = "../../shared/images/"

const RESOURCE_DIR = "resources/"
const IMAGES_DIR = RESOURCE_DIR + "images/"
const IMAGES_SHARED_DIR = IMAGES_DIR + "shared/"
const PLAYER_DIR = "../../player/"
const Case = use('App/Models/v1/Case');

class ImageSeeder {
  async run () {

    let indexFile = fs.readFileSync(PLAYER_DIR + 'index.html', "utf8")
    let c = await Case.find(1)

      let htmlFile = await Factory.model('App/Models/v1/HtmlFile').make({ name: 'index.html', content: indexFile })

      let jsPlayerFiles = fs.readdirSync(PLAYER_DIR + "js")

      for (let j = 0; j < jsPlayerFiles.length; j++) {
        let js = await Factory.model('App/Models/v1/JavaScript').make({ name: jsPlayerFiles[j], content: fs.readFileSync(PLAYER_DIR + "js/" + jsPlayerFiles[j], 'utf8') })
        // console.log(c.javascripts().create(js))
        Object.assign(c.toJSON(), { tasks: [] })
      } 
      console.log(c)

  }
}

module.exports = ImageSeeder
