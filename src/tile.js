const {TILE_DISPLAY_STEPS} = require('./constants')

const createTile = ({hide = false} = {}) => {
  return {
    display: !hide,
    remainingSteps: TILE_DISPLAY_STEPS
  }
}

module.exports = createTile
