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

const {
  mobMove,
  worldUpdate,
  setGameState
} = require('./actions')

const dataStore = require('./dataStore')

const sound = require('./sound')

const handleKeyDown = event => {
  let updateWorld = false
  const state = dataStore.getState()

  if (event.keyCode === 13 && state.gameState === 'start') {
    dataStore.dispatch(setGameState({state: 'main'}))
  }

  if (event.keyCode === 13 && state.gameState === 'end') {
    const maxGold = window.localStorage.getItem('maxGold') || 0

    if (state.mobs[0].gold > maxGold) {
      window.localStorage.setItem('maxGold', state.mobs[0].gold)
    }
    window.location.reload()
  }

  if (state.gameState !== 'main') {
    return
  }

  switch (event.keyCode) {
    case KEY_LEFT:
      dataStore.dispatch(mobMove({
        direction: WEST,
        id: playerId
      }))
      updateWorld = true
      break
    case KEY_RIGHT:
      dataStore.dispatch(mobMove({
        direction: EAST,
        id: playerId
      }))
      updateWorld = true
      break
    case KEY_UP:
      dataStore.dispatch(mobMove({
        direction: NORTH,
        id: playerId
      }))
      updateWorld = true
      break
    case KEY_DOWN:
      dataStore.dispatch(mobMove({
        direction: SOUTH,
        id: playerId
      }))
      updateWorld = true
      break
    case KEY_ONE:
    case KEY_TWO:
    case KEY_THREE:
    case KEY_FOUR:
      console.log('action button pressed')
      break
  }

  if (updateWorld) {
    sound.walk()
    dataStore.dispatch(worldUpdate())
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
