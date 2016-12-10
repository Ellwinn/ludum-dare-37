const isRequired = require('./isRequired')
const dataStore = require('./dataStore')
const {
  TILE_SIZE,
  NORTH,
  SOUTH,
  EAST,
  WEST,
  MOB_MOVE_STEPS
} = require('./constants')

const expect = property => isRequired({
  property,
  category: 'render'
})

const createRender = ({
  canvas = expect('canvas'),
  ctx = expect('ctx')
} = {}) => {
  return () => {
    const state = dataStore.getState()

    state.world.forEach((row, y) => {
      row.forEach((item, x) => {
        ctx.fillStyle = `hsl(200, 50%, 50%)`
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      })
    })

    state.mobs.forEach(mob => {
      let x = mob.position.x * TILE_SIZE
      let y = mob.position.y * TILE_SIZE

      if (mob.active && mob.remainingStops !== 0) {
        const offset = (mob.remainingSteps / MOB_MOVE_STEPS) * TILE_SIZE
        switch (mob.direction) {
          case NORTH:
            y += offset
            break
          case SOUTH:
            y -= offset
            break
          case EAST:
            x -= offset
            break
          case WEST:
            x += offset
            break
        }
      }

      ctx.fillStyle = '#000'
      ctx.save()
      ctx.translate(x, y)
      ctx.fillRect(1, 1, 30, 30)
      ctx.restore()
    })
  }
}

module.exports = {
  createRender
}
