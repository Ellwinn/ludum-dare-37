const tap = require('tap')
const constants = require('./constants')

tap.test('constants', test => {
  test.equal(constants.TILE_SIZE, 32, 'Tile size is 32')
  test.equal(constants.WORLD_WIDTH, 15, 'World width is 15')
  test.equal(constants.WORLD_HEIGHT, 11, 'World height is 11')

  test.end()
})
