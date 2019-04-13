'use strict'

const DIR_TEMPLATES = "../../templates/";
const fs = require('fs');

class TemplateController {
    async index({ response }) {
        try{
            let templates = fs.readdirSync(DIR_TEMPLATES, {withFileTypes: true});
            let templatesName = []
            
            templates.forEach(element => {
                if (!element.isFile())
                    templatesName.push(element.name)
            });            
            return response.json({templateFamiliesList: templatesName})
        } catch(e){
            console.log(e)
        }

    }
}

module.exports = TemplateController
