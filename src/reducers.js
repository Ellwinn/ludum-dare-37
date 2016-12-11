const {
  NORTH,
  SOUTH,
  EAST,
  WEST,
  MOB_MOVE_STEPS,
  WORLD_WIDTH,
  WORLD_HEIGHT
} = require('./constants')

const createTile = require('./tile')
const createMob = require('./mob')

const reducerTypes = {
  UPDATE: 'UPDATE',
  MOB_MOVE: 'MOB_MOVE',
  WORLD_CREATE_TILE: 'WORLD_CREATE_TILE',
  WORLD_UPDATE: 'WORLD_UPDATE'
}

const reducers = (state, action) => {
  switch (action.type) {
    case reducerTypes.MOB_MOVE:
      return Object.assign({}, state, {
        mobs: state.mobs.map(mob => {
          if (mob.id !== action.id) {
            return mob
          }

          if (!mob.active) {
            switch (action.direction) {
              case SOUTH:
                if (mob.position.y + 1 >= WORLD_HEIGHT) {
                  return mob
                }
                mob.position.y++
                break
              case NORTH:
                if (mob.position.y - 1 < 0) {
                  return mob
                }
                mob.position.y--
                break
              case EAST:
                if (mob.position.x + 1 >= WORLD_WIDTH) {
                  return mob
                }
                mob.position.x++
                break
              case WEST:
                if (mob.position.x - 1 < 0) {
                  return mob
                }
                mob.position.x--
                break
            }

            mob.active = true
            mob.remainingSteps = MOB_MOVE_STEPS
            mob.direction = action.direction
          }
          return mob
        })
      })

    case reducerTypes.UPDATE:
      return Object.assign({}, state, {
        world: state.world.map((row, y) => {
          return row.map((tile, x) => {
            if (tile !== null) {
              if (tile.remainingSteps > 0) {
                tile.remainingSteps -= action.timePassed
              }

              if (tile.remainingSteps <= 0) {
                tile.remainingSteps = 0
              }
            }

            return tile
          })
        }),
        mobs: state.mobs.map(mob => {
          if (mob.active) {
            mob.remainingSteps -= action.timePassed
          }

          if (mob.remainingSteps <= 0) {
            mob.remainingSteps = 0
            mob.active = false
          }

          return mob
        })
      })

    case reducerTypes.WORLD_CREATE_TILE:
      return Object.assign({}, state, {
        world: state.world.map((row, y) => {
          return row.map((item, x) => {
            if (item === null && x === action.x && y === action.y) {
              item = 1
            }

            return item
          })
        })
      })

    case reducerTypes.WORLD_UPDATE:
      {
        const shouldCreateMob = Math.random() < 0.1
        const availableMobPositions = []
        const activeTiles = state.mobs[0].getSurroundingTiles()
        const world = state.world.map((rows, y) => {
          return rows.map((item, x) => {
            let changed = false
            activeTiles.forEach(tile => {
              if (x === tile.x && y === tile.y) {
                changed = true
                if (
                  item === null ||
                  (item.remainingSteps <= 0 && item.display === false)
                ) {
                  availableMobPositions.push({x, y})
                  item = createTile()
                }
              }
            })

            if (
              !changed &&
              item !== null &&
              item.display
            ) {
              item = createTile({hide: true})
            }
            return item
          })
        })
        const mobs = state.mobs

        if (shouldCreateMob) {
          const key = Math.floor(Math.random() * availableMobPositions.length)
          mobs.push(createMob(availableMobPositions[key]))
        }

        return Object.assign({}, state, {world, mobs})
      }

    default:
      return Object.assign({}, state)
  }
}

module.exports = {
  reducerTypes,
  reducers
}
