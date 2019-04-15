'use strict'

const fs = require('fs');

const DIR_MODELS = "../../models/"

class ModelController {
    async index({ response }) {
        try{
  
            let models = fs.readdirSync(DIR_MODELS);
  
            return response.json({modelsList: models})
        } catch(e){
            console.log(e)
        }

    }
}

module.exports = ModelController
