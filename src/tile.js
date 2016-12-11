const {TILE_DISPLAY_STEPS} = require('./constants')

const createTile = ({hide = false} = {}) => {
  return {
    display: !hide,
    remainingSteps: TILE_DISPLAY_STEPS,
    color: `hsl(${Math.floor(Math.random() * 10 + 180)}, 50%, 30%)`
  }
}

module.exports = createTile
