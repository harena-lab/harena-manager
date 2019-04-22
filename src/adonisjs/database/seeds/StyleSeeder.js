'use strict'

/*
|--------------------------------------------------------------------------
| StyleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const fs = require('fs');

const RESOURCE_DIR = "resources/"
const TEMPLATE_DIR = RESOURCE_DIR + "templates/"

const CASES_DIR = RESOURCE_DIR + "cases/"


class StyleSeeder {
  async run () {
    let templateNameDirs = fs.readdirSync(TEMPLATE_DIR)

    for (let i = 0; i < templateNameDirs.length; i++) {
      let style = await Factory.model('App/Models/v1/Style').create({ name: templateNameDirs[i]})

      let templateFamilyDir = TEMPLATE_DIR + templateNameDirs[i] + "/"

      try {
        let cssDir = templateFamilyDir + "css/"
        fs.accessSync(cssDir, fs.constants.F_OK);

        let cssFileNames = fs.readdirSync(cssDir)

        let cssFiles = []

        for (let j = 0; j < cssFileNames.length; j++) {
          let css = await Factory.model('App/Models/v1/CssFile').make({ name: cssFileNames[j], content: fs.readFileSync(cssDir + cssFileNames[j], 'utf8') })
          await style.cssFiles().save(css)
        }


      } catch (err) {
        console.log(err)
        return;
      }

      try {
        const IMAGES_DIR = RESOURCE_DIR + "images/"
        const TEMPLATES_IMAGES_DIR = IMAGES_DIR + "templates/"
        const TEMPLATE_FAMILY_IMAGES_DIR = TEMPLATES_IMAGES_DIR + templateNameDirs[i] +"/"
        
        try{
          fs.accessSync(IMAGES_DIR, fs.constants.F_OK);
        } catch(err){
          fs.mkdirSync(IMAGES_DIR)
        }
        try{
          fs.accessSync(TEMPLATES_IMAGES_DIR, fs.constants.F_OK);
        } catch(err){
          fs.mkdirSync(TEMPLATES_IMAGES_DIR)
        }
        try{
          fs.accessSync(TEMPLATE_FAMILY_IMAGES_DIR, fs.constants.F_OK);
        } catch(err){
          fs.mkdirSync(TEMPLATE_FAMILY_IMAGES_DIR)
        }

        let imagesDir = templateFamilyDir + "images/"
        fs.accessSync(imagesDir, fs.constants.F_OK);

        let imageFileNames = fs.readdirSync(imagesDir)

        for (let j = 0; j < imageFileNames.length; j++) {
          fs.copyFileSync(imagesDir + imageFileNames[j], TEMPLATE_FAMILY_IMAGES_DIR + imageFileNames[j]);
          let image = await Factory.model('App/Models/v1/Image').make({ name: imageFileNames[j], url: TEMPLATE_FAMILY_IMAGES_DIR + imageFileNames[j]})
          await style.images().save(image)
        }


      } catch (err) {
        console.log(err)
        return;
      }


    }
  }
}

module.exports = StyleSeeder
