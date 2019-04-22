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

class DccSeeder {
  async run () {
    let dccsName = fs.readdirSync(DCCS_DIR)
    
    for (let i = 0; i < dccsName.length; i++) {
      if (dccsName[i] != "README.md"){
        // console.log(dccsName[i])
        let files = fs.readdirSync(DCCS_DIR + dccsName[i])
        console.log(files)
        
        // let jss = []
        // for (let j = 0; j < files.length; j++) {
        //   console.log(files[j])
        //   let jsFile = fs.readFileSync(DCCS_DIR + dccsName[i] + "/" + files[i], 'utf8')
        //   jss.push({name:files[i], content: jsFile })
        // }
        // console.log(jss)
      }
    }

   
  }
}

module.exports = DccSeeder
