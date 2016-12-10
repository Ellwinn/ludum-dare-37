const {createBus} = require('./bus')
const {reducers} = require('./reducers')

const x = 10
const y = 10

const defaultState = {
  world: new Array(y).fill(new Array(x).fill(null))
}

module.exports = createBus({reducers, defaultState})
