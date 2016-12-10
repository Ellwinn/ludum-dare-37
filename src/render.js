const isRequired = require('./isRequired')
const dataStore = require('./dataStore')
const {
  TILE_SIZE
} = require('./constants')

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
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
    })
  })

  state.mobs.forEach(mob => {
    ctx.fillStyle = '#000'
    ctx.save()
    ctx.translate(mob.position.x * TILE_SIZE, mob.position.y * TILE_SIZE)
    ctx.fillRect(1, 1, 30, 30)
    ctx.restore()
  })

  return () => {
  }
}

module.exports = {
  createRender
}
