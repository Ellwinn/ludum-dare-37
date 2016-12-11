const isRequired = require('./isRequired')
const dataStore = require('./dataStore')
const {
  TILE_SIZE,
  NORTH,
  SOUTH,
  EAST,
  WEST,
  MOB_MOVE_STEPS,
  TILE_DISPLAY_STEPS
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

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    state.world.forEach((row, y) => {
      row.forEach((item, x) => {
        if (item !== null) {
          const alpha = item.display ? (
            1 - (item.remainingSteps / TILE_DISPLAY_STEPS)
          ) : (
            item.remainingSteps / TILE_DISPLAY_STEPS
          )
          // ctx.fillStyle = `hsla(200, 50%, 50%, ${alpha})`
          ctx.fillStyle = item.color
            .replace(/^hsl/, 'hsla')
            .replace(/\)$/, `, ${alpha})`)
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        }
      })
    })

    state.mobs.forEach((mob, index) => {
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

      ctx.fillStyle = `hsl(${index === 0 ? 170 : 350}, 50%, 50%)`
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
