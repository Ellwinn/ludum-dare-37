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

  const hud = document.createElement('p')

  const canvas = document.createElement('canvas')
  canvas.width = TILE_SIZE * WORLD_WIDTH
  canvas.height = TILE_SIZE * WORLD_HEIGHT

  canvas.setAttribute('style', `width: ${canvas.width * 8}px;`)

  const ctx = canvas.getContext('2d')

  game({canvas, ctx, dataStore, hud})
  document.body.appendChild(canvas)

  const state = dataStore.getState()
  input.start(state.mobs[0].id)

  dataStore.dispatch(worldUpdate())

  hud.innerHTML = 'Press "enter" to start.'

  document.body.appendChild(hud)

  const rules = document.createElement('p')
  rules.innerHTML = `
  Use the arrow keys to move. Stay alive and get as much gold as you can.
  To attack just move in the direction of the enemy player.
  `
  document.body.appendChild(rules)
}

window.addEventListener('DOMContentLoaded', init)
