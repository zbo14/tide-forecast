'use strict'

const fs = require('fs')
const getLowTides = require('./src')

const main = (beaches) => {
  beaches.map((beach) => {
    getLowTides(beach, (err, state) => {
      if (err) {
        throw err
      }
      const pretty = JSON.stringify(state, null, 2)
      fs.writeFileSync(`./output/${beach}.json`, pretty)
      console.log(pretty)
    })
  })
}

main([
  'half-moon-bay',
  'huntington-beach',
  'providence',
  'wrightsville-beach'
])