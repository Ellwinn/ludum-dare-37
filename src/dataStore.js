const {createBus} = require('./bus')
const {reducers} = require('./reducers')
const mob = require('./mob')
const {
  WORLD_WIDTH,
  WORLD_HEIGHT
} = require('./constants')

const defaultState = {
  world: new Array(WORLD_HEIGHT).fill(new Array(WORLD_WIDTH).fill(null)),
  mobs: [
    mob({
      x: Math.round((WORLD_WIDTH - 1) * 0.5),
      y: Math.round((WORLD_HEIGHT - 1) * 0.5)
    })
  ],
  gameState: 'start'
}

module.exports = createBus({reducers, defaultState})
