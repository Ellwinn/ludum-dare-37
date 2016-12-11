const tap = require('tap')
const createTile = require('./tile')
const {TILE_DISPLAY_STEPS} = require('./constants')

const hslRegex = /hsl\([0-9]+,\s[0-9]+%,\s[0-9]+%\)/

tap.test('tile', test => {
  const tile = createTile()

  test.equal(tile.display, true)
  test.equal(tile.remainingSteps, TILE_DISPLAY_STEPS)
  test.equal(hslRegex.test(tile.color), true)

  test.end()
})

tap.test('tile old', test => {
  const tile = createTile({
    hide: true
  })

  test.equal(tile.display, false)
  test.equal(tile.remainingSteps, TILE_DISPLAY_STEPS)
  test.equal(hslRegex.test(tile.color), true)

  test.end()
})
