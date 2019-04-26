'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Dcc extends Model {
    case(){
        return this.belongsTo('App/Models/v1/Case');
    }

    htmlFiles(){
        return this.hasMany('App/Models/v1/HtmlFile')
    }

    javascripts(){
        return this.hasMany('App/Models/v1/JavaScript')
    }

    cssFiles(){
        return this.hasMany('App/Models/v1/CssFile')
    }

    images(){
        return this.hasMany('App/Models/v1/Image')
    }
}

module.exports = Dcc
