const isRequired = require('./isRequired')
const dataStore = require('./dataStore')
const {mobsUpdate} = require('./actions')

const expect = property => isRequired({
  property,
  category: 'update'
})

const createUpdate = ({
  canvas = expect('canvas'),
  ctx = expect('ctx')
} = {}) => {
  return timePassed => {
    dataStore.dispatch(mobsUpdate({timePassed}))
  }
}

module.exports = {
  createUpdate
}
