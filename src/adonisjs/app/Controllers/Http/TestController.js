'use strict'

class TestController {
    async test(){
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
}

module.exports = TestController
