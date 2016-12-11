const isRequired = require('./isRequired')
const dataStore = require('./dataStore')
const {update} = require('./actions')

const sound = require('./sound')

const expect = property => isRequired({
  property,
  category: 'update'
})

const createUpdate = ({
  canvas = expect('canvas'),
  ctx = expect('ctx')
} = {}) => {
  let triggered = false

  return timePassed => {
    const state = dataStore.getState()

    if (state.gameState === 'end' && !triggered) {
      triggered = true
      sound.gameOver()
    } else {
      dataStore.dispatch(update({timePassed}))
    }
  }
}

module.exports = {
  createUpdate
}
