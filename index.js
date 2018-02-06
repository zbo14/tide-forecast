'use strict'

const fs = require('fs')
const getLowTides = require('./src')

const main = (beaches) => {

  beaches.map((beach) => {

    getLowTides(beach, (err, state) => {
      
      if (err) {
        throw err
      }

      // Pretty print
      const pretty = JSON.stringify(state, null, 2)
      console.log(pretty)

      // Write to file
      fs.writeFileSync(`./output/${beach}.json`, pretty)
    })
  })
}

main([
  'half-moon-bay',
  'huntington-beach',
  'providence',
  'wrightsville-beach'
])