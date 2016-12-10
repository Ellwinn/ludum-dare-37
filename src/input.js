// TODO get keys from constants

const handleKeyDown = event => {
  console.log('event', event.keyCode)
}

const start = () => {
  window.addEventListener('keydown', handleKeyDown)
}

const stop = () => {
  window.removeEventListener('keydown', handleKeyDown)
}

module.exports = {
  start,
  stop
}
