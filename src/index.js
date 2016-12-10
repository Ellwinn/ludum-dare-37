const init = () => {
  window.removeEventListener('DOMContentLoaded', init)

  const canvas = document.createElement('canvas')
  canvas.width = 320
  canvas.height = 320

  const ctx = canvas.getContext('2d')
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  document.body.appendChild(canvas)
}

window.addEventListener('DOMContentLoaded', init)
