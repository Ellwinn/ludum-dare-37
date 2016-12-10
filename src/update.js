const isRequired = require('./isRequired')
const dataStore = require('./dataStore')

const expect = property => isRequired({
  property,
  category: 'update'
})

const createUpdate = ({
  canvas = expect('canvas'),
  ctx = expect('ctx')
} = {}) => {
  const state = dataStore.getState()
  console.log(state)

  return (time) => {
  }
}

module.exports = {
  createUpdate
}
