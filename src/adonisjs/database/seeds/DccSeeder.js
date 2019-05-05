'use strict'

/*
|--------------------------------------------------------------------------
| DccSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const fs = require('fs');
const path = require("path");

const DCCS_DIR = "../../dccs/"

const RESOURCE_DIR = "resources/"
const IMAGES_DIR = RESOURCE_DIR + "images/"
const DCCS_IMAGES_DIR = IMAGES_DIR + "dccs/"

const Dcc = use('App/Models/v1/Dcc');

class DccSeeder {
  async run () {
    let dccsName = fs.readdirSync(DCCS_DIR)
    
    for (let i = 0; i < dccsName.length; i++) {
      if (dccsName[i] != "README.md"){
        const DCC_FAMILY_IMAGES_DIR = DCCS_IMAGES_DIR + dccsName[i] +"/"

        try{
          fs.accessSync(DCCS_IMAGES_DIR, fs.constants.F_OK);
        } catch(err){
          fs.mkdirSync(DCCS_IMAGES_DIR)
        }
        try{
          fs.accessSync(DCC_FAMILY_IMAGES_DIR, fs.constants.F_OK);
        } catch(err){
          fs.mkdirSync(DCC_FAMILY_IMAGES_DIR)
        }
        
        let dcc = await Factory.model('App/Models/v1/Dcc').create({ name: dccsName[i] })
        // dcc await DCC.find(dcc.id)
        let DCC_BY_NAME_DIR = DCCS_DIR + dccsName[i] + "/"
        let files = fs.readdirSync(DCC_BY_NAME_DIR)
        
        for (let j = 0; j < files.length; j++) {
          await this.explore(DCC_BY_NAME_DIR+files[j], dcc)
        }
      }
    }
  }

  async explore(DIR, dcc){
    if (fs.lstatSync(DIR).isDirectory() ){

      let files = fs.readdirSync(DIR)
      
      for (let j = 0; j < files.length; j++) {
        await this.explore(DIR+ '/' + files[j], dcc)
      }
      return
    }
    
    let file =  DIR.split(path.sep).pop()

    let xt = path.extname(DIR).toLowerCase()
    if (xt === ".html"){
      let html = await Factory.model('App/Models/v1/HtmlFile').make({ name: file, content: fs.readFileSync(DIR, 'utf8') })
      await dcc.htmlFiles().save(html)
    }
    if (xt === ".js"){
      let js = await Factory.model('App/Models/v1/JavaScript').make({ name: file, content: fs.readFileSync(DIR, 'utf8') })
      await dcc.javascripts().save(js)
    }
    if (xt === ".css"){
      let css = await Factory.model('App/Models/v1/CssFile').make({ name: file, content: fs.readFileSync(DIR, 'utf8') })
      await dcc.cssFiles().save(css)
    }
    if (xt === ".svg" || xt === ".png"){
      let url = DCCS_IMAGES_DIR + path.dirname(DIR).split(path.sep)[3] + "/" + file

      fs.copyFileSync(DIR, url);
      
      let image = await Factory.model('App/Models/v1/Image').make({ name: file, url: url })
      await dcc.images().save(image)
    }
  }
}

module.exports = DccSeeder
