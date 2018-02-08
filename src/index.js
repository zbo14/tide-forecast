'use strict'

const request = require('request')

const URLS = {
  'half-moon-bay': 'https://www.tide-forecast.com/locations/Half-Moon-Bay-California/tides/latest',
  'huntington-beach': 'https://www.tide-forecast.com/locations/Huntington-Beach/tides/latest',
  'providence': 'https://www.tide-forecast.com/locations/Providence-Rhode-Island/tides/latest',
  'wrightsville-beach': 'https://www.tide-forecast.com/locations/Wrightsville-Beach-North-Carolina/tides/latest' 
}

const get = (url, cb) => {
  request(url, (err, resp, html) => {
    if (err) {
      return cb(err)
    } else if (resp.statusCode !== 200) {
      const err = new Error('HTTP Response statusCode=' + resp.statusCode)
      return cb(err)
    }
    cb(null, html)
  })
}

const update = (event, state, tds) => {
  const foundDate = tds.find((td) => /"date"/.test(td))
  if (foundDate) {
    state.date = foundDate.match(/>(.*?)</)[1]
  }
  switch (event) {
    case 'Sunrise':
      if (!state.addLowTide) {
        state.addLowTide = true
      }
      break
    case 'Sunset':
      if (state.addLowTide) {
        state.addLowTide = false
      }
      break
    case 'Low Tide':
      if (state.addLowTide) {
        const foundTime = tds.find((td) => /"time tide"/.test(td))
        const foundHeight = tds.find((td) => /"level metric"/.test(td))
        const time = foundTime.match(/>(.*?)</)[1]
        const height = foundHeight.match(/>(.*?)</)[1]
        state.lowTides.push({
          'date': state.date,
          'time': time,
          'height': height
        })
      }
    default:
  }
}

// Extract height and times of low tides that occur after sunrise and before sunset

module.exports = (beach, cb) => {
  const url = URLS[beach]
  if (!url) {
    const err = new Error('unrecognized beach: ' + beach)
    return cb(err)
  }
  get(url, (err, html) => {
    if (err) {
      return cb(err)
    }
    // Match table rows
    const trs = html.match(/<tr[\s\S]*?\/tr>/g)
    // Initial state
    const state = {
      'addLowTide': false,
      'beach': beach,
      'lowTides': [],
      'date': null
    }
    trs.forEach((tr) => {
      // Match table data
      const tds = tr.match(/<td[\s\S]*?\/td>/g)
      // Match event (Sunrise, Sunset, Low Tide, other)
      const event = tds.pop().match(/>(.*?)</)[1]

      update(event, state, tds)
    })
    delete state.addLowTide
    delete state.date
    cb(null, state)
  })
}