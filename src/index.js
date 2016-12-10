const game = require('./game')
const dataStore = require('./dataStore')

const init = () => {
  window.removeEventListener('DOMContentLoaded', init)

  const canvas = document.createElement('canvas')
  canvas.width = 320
  canvas.height = 320

  const ctx = canvas.getContext('2d')

  game({canvas, ctx, dataStore})
  document.body.appendChild(canvas)
}

window.addEventListener('DOMContentLoaded', init)
