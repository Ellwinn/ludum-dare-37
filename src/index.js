const game = require('./game')
const dataStore = require('./dataStore')
const input = require('./input')

const {
  TILE_SIZE,
  WORLD_WIDTH,
  WORLD_HEIGHT
} = require('./constants')

const {
  worldUpdate
} = require('./actions')

const init = () => {
  window.removeEventListener('DOMContentLoaded', init)

  const canvas = document.createElement('canvas')
  canvas.width = TILE_SIZE * WORLD_WIDTH
  canvas.height = TILE_SIZE * WORLD_HEIGHT

  canvas.setAttribute('style', `width: ${canvas.width * 8}px;`)

  const ctx = canvas.getContext('2d')

  game({canvas, ctx, dataStore})
  document.body.appendChild(canvas)

  const state = dataStore.getState()
  input.start(state.mobs[0].id)

  dataStore.dispatch(worldUpdate())
}

window.addEventListener('DOMContentLoaded', init)
