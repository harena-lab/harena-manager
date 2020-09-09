'use strict'

const Case = use('App/Models/v1/Case')
const CloudinaryService = use('App/Services/CloudinaryService')

class TestController {
  async test () {
    console.log('Method reached')

    // const profilePic = request.file('profile_pic', {
    //     types: ['image'],
    //     size: '2mb'
    // })

    //   await profilePic.move(Helpers.tmpPath('uploads'), {
    //     name: 'custom-name.jpg',
    //     overwrite: true
    //   })

    //   if (!profilePic.moved()) {
    //     return profilePic.error()
    //   }
    //   return 'File moved'
  }

  async index ({ view }) {
    const cases = await Case.all()
    // console.log(cases.toJSON())
    return view.render('index', { cases: cases.toJSON() })
  }

  async create ({ request, response, view, session }) {
    console.log('chegou')
    const { name } = request.all()
    const file = request.file('image')
    try {
      const cloudinaryResponse = await CloudinaryService.v2.uploader.upload(file.tmpPath, { folder: 'harena' })
      const c = new Case()
      c.name = name
      c.image_url = cloudinaryResponse.secure_url
      await c.save()
      session.flash({ success: 'Successfully added case' })
      return response.redirect('back')
    } catch (e) {
      console.log(e)
      session.flash({ error: 'Error Uploading Image' })
      return response.redirect('/')
    }
  }
}

module.exports = TestController
