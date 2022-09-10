const hbjs = require('handbrake-js')

hbjs.spawn({ input: '/app/public/resources/artifacts/gertie.mov', output: '/app/public/resources/artifacts/gertie.mp4' })
  .on('error', err => {
    console.log(err)
  })
  .on('progress', progress => {
    console.log(
      'Percent complete: %s, ETA: %s',
      progress.percentComplete,
      progress.eta
    )
  })
