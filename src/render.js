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

  state.world.forEach((row, y) => {
    row.forEach((item, x) => {
      ctx.fillStyle = `hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`
      ctx.fillRect(x * 32, y * 32, 32, 32)
    })
  })

  return () => {
  }
}

module.exports = {
  createRender
}
