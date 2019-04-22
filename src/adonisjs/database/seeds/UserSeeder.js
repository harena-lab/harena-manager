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
const TEMPLATE_DIR = RESOURCE_DIR + "templates/"
const CASES_DIR = RESOURCE_DIR + "cases/"


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

    await Factory.model('App/Models/v1/HtmlFile').create({ name: 'index.html', content: fs.readFileSync(RESOURCE_DIR + 'index.html', 'utf8') })



    let infraFiles = fs.readdirSync(INFRA_DIR)

    var jsFiles = infraFiles.filter(function(file) {
      return path.extname(file).toLowerCase() === ".js";
    });

    let jss = []

    jsFiles.forEach(file => {
      jss.push({name: file, content: fs.readFileSync(INFRA_DIR + file, 'utf8') })
    });

    await Factory.model('App/Models/v1/JavaScript').createMany(jss.length, jss)



    let templateNameDirs = fs.readdirSync(TEMPLATE_DIR)

    for (let i = 0; i < templateNameDirs.length; i++) {
      let templateFamilyDir = TEMPLATE_DIR + templateNameDirs[i] + "/"

      try {
        let cssDir = templateFamilyDir + "css/"
        fs.accessSync(cssDir, fs.constants.F_OK);

        let cssFileNames = fs.readdirSync(cssDir)

        let cssFiles = []

        cssFileNames.forEach(cssFileName => {
          cssFiles.push({ name: cssFileName, content: fs.readFileSync(cssDir + cssFileName, 'utf8') })
        });

        await Factory.model('App/Models/v1/CssFile').createMany(cssFiles.length, cssFiles)
      } catch (err) {
        return;
      }

      try {
        const CASE_DIR = CASES_DIR + c.name
        const IMAGE_CASE_DIR = CASE_DIR + "/images/"

        fs.access(CASES_DIR, fs.constants.F_OK, (err) => {
          if (err) fs.mkdirSync(CASES_DIR)
          
          fs.access(CASE_DIR, fs.constants.F_OK, (err) => {
            if (err) fs.mkdirSync(CASE_DIR)

            fs.access(IMAGE_CASE_DIR, fs.constants.F_OK, (err) => {
              if (err) fs.mkdirSync(IMAGE_CASE_DIR)
            })
          })
        })

        let imagesDir = templateFamilyDir + "images/"
        fs.accessSync(imagesDir, fs.constants.F_OK);

        let imageFileNames = fs.readdirSync(imagesDir)

        let imageFiles = []

        for (let i = 0; i < imageFileNames.length; i++) {
          console.log(imageFileNames[i])
          fs.copyFileSync(imagesDir + imageFileNames[i], IMAGE_CASE_DIR + imageFileNames[i]);
          await imageFiles.push({ name: imageFileNames[i], url: IMAGE_CASE_DIR + imageFileNames[i] })
          console.log(imageFiles)
        }

        imageFileNames.forEach(imageFileName => {
          
        });

        await Factory.model('App/Models/v1/Image').createMany(imageFiles.length, imageFiles)
      } catch (err) {
        console.log(err)
        return;
      }
    }

    // templateNameDirs.forEach(async templateNameDir => {
    //   let templateFamilyDir = TEMPLATE_DIR + templateNameDir + "/"

    //   try {
    //     fs.accessSync(templateFamilyDir + "css/", fs.constants.F_OK);
    //     console.log('can read/write');

    //     let files = fs.readdirSync(templateFamilyDir + "css/")

    //     let jss = []

    //     files.forEach(file => {
    //       console.log('file'+templateFamilyDir + "css/" + file)
    //       jss.push({name: file, content: fs.readFileSync(templateFamilyDir + "css/" + file, 'utf8') })
    //     });

    //     // console.log(jss)
    //     await Factory.model('App/Models/v1/CssFile').createMany(jss.length, jss)
    //     console.log('aqui')
    //   } catch (err) {
    //     console.error('no access!');
    //     return;
    //   }




    //   console.log('terminou')
    // });

    console.log('depois')

  }
}

module.exports = UserSeeder
