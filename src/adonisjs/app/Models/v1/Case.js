'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Case extends Model {
    user() {
        return this.belongsTo('App/Models/v1/User');
    }

    versions(){
        return this.hasMany('App/Models/v1/CaseVersion')
    }

    htmlFiles(){
        return this.hasMany('App/Models/v1/HtmlFile')
    }

    javascripts(){
        return this.hasMany('App/Models/v1/JavaScript')
    }

    cssFiles(){
        return this.hasMany('App/Models/v1/CSSFile')
    }

    images(){
        return this.hasMany('App/Models/v1/Image')
    }

    dccs(){
        return this.hasMany('App/Models/v1/Dcc')
    }
} 

module.exports = Case
