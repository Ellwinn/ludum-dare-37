const isRequired = require('./isRequired')
const dataStore = require('./dataStore')

const expect = property => isRequired({
  property,
  category: 'render'
})

const createRender = ({
  canvas = expect('canvas'),
  ctx = expect('ctx')
} = {}) => {
  const state = dataStore.getState()
  console.log(state)

  return () => {
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}

module.exports = {
  createRender
}
