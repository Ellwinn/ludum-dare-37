const {reducerTypes} = require('./reducers')

const playerMove = ({direction = null} = {}) => {
  return {
    direction,
    type: reducerTypes.PLAYER_MOVE
  }
}

module.exports = {
  playerMove
}
