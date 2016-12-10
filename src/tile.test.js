const tap = require('tap')
const createTile = require('./tile')
const {TILE_DISPLAY_STEPS} = require('./constants')

tap.test('tile', test => {
  const tile = createTile()

  test.equal(tile.display, true)
  test.equal(tile.remainingSteps, TILE_DISPLAY_STEPS)

  test.end()
})

tap.test('tile old', test => {
  const tile = createTile({
    hide: true
  })

  test.equal(tile.display, false)
  test.equal(tile.remainingSteps, TILE_DISPLAY_STEPS)

  test.end()
})
