let playerId = null

const {
  NORTH,
  SOUTH,
  EAST,
  WEST,
  KEY_LEFT,
  KEY_RIGHT,
  KEY_UP,
  KEY_DOWN,
  KEY_ONE,
  KEY_TWO,
  KEY_THREE,
  KEY_FOUR
} = require('./constants')

const {mobMove} = require('./actions')
const dataStore = require('./dataStore')

const handleKeyDown = event => {
  switch (event.keyCode) {
    case KEY_LEFT:
      dataStore.dispatch(mobMove({
        direction: WEST,
        id: playerId
      }))
      break
    case KEY_RIGHT:
      dataStore.dispatch(mobMove({
        direction: EAST,
        id: playerId
      }))
      break
    case KEY_UP:
      dataStore.dispatch(mobMove({
        direction: NORTH,
        id: playerId
      }))
      break
    case KEY_DOWN:
      dataStore.dispatch(mobMove({
        direction: SOUTH,
        id: playerId
      }))
      break
    case KEY_ONE:
    case KEY_TWO:
    case KEY_THREE:
    case KEY_FOUR:
      console.log('action button pressed')
      break
  }
}

const start = (id) => {
  playerId = id
  window.addEventListener('keydown', handleKeyDown)
}

const stop = () => {
  window.removeEventListener('keydown', handleKeyDown)
}

module.exports = {
  start,
  stop
}
