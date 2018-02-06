'use strict'

const expect = require('chai').expect
const {define, it} = require('mocha')
const getLowTides = require('../src')

const testLowTides = (beach, done) => {
  getLowTides(beach, (err, state) => {
    expect(err).to.be.null
    expect(state).to.be.an('object')
    expect(state.beach).to.equal(beach)
    // TODO: check lowTides
    done()
  })
}

const testUnrecognizedBeach = (beach, done) => {
  getLowTides(beach, (err) => {
    expect(err).to.be.an('error')
    done()
  })
}

describe('tide-forecast', () => {

  it('gets low tides for half-moon-bay', (done) => {
    testLowTides('half-moon-bay', done)
  })

  it('gets low tides for huntington-beach', (done) => {
    testLowTides('huntington-beach', done)
  })

  it('gets low tides for providence', (done) => {
    testLowTides('providence', done)
  })

  it('gets low tides for wrightsville-beach', (done) => {
    testLowTides('wrightsville-beach', done)
  })
    
  it('unrecognized beach', (done) => {
    testUnrecognizedBeach('hingham', done)
  })
})