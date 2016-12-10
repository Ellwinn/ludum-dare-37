const isRequired = require('./isRequired')
const loop = require('lb-loop')
const {createUpdate} = require('./update')
const {createRender} = require('./render')

const expect = property => isRequired({
  property,
  category: 'game'
})

module.exports = ({
  canvas = expect('canvas'),
  ctx = expect('ctx')
} = {}) => {
  const update = createUpdate({canvas, ctx})
  const render = createRender({canvas, ctx})

  const game = loop({
    update,
    render
  })

  game.start()

  return game
}
