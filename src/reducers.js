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
const collision = require('./collision')
const battle = require('./battle')
const heal = require('./heal')

const reducerTypes = {
  UPDATE: 'UPDATE',
  MOB_MOVE: 'MOB_MOVE',
  WORLD_CREATE_TILE: 'WORLD_CREATE_TILE',
  WORLD_UPDATE: 'WORLD_UPDATE',
  SET_GAME_STATE: 'SET_GAME_STATE'
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
            const originalPosition = {
              x: mob.position.x,
              y: mob.position.y
            }

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

            const collisions = collision({
              id: mob.id,
              position: mob.position,
              elements: state.mobs
            })

            collisions.forEach(id => {
              mob.position = originalPosition
              const defender = state.mobs.filter(mob => mob.id === id)[0]
              battle([mob, defender])
            })

            if (collisions.length > 0) {
              return mob
            }

            mob.active = true
            mob.remainingSteps = MOB_MOVE_STEPS
            mob.direction = action.direction
            heal(mob)
          }
          return mob
        })
      })

    case reducerTypes.UPDATE:
      {
        let gameEnd = false
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
          mobs: state.mobs.map((mob, index) => {
            if (mob.health === 0) {
              if (index === 0) {
                gameEnd = true
              } else {
                return null
              }
            }

            if (mob.active) {
              mob.remainingSteps -= action.timePassed
            }

            if (mob.remainingSteps <= 0) {
              mob.remainingSteps = 0
              mob.active = false
            }

            return mob
          })
            .filter(item => item !== null),
          gameState: gameEnd ? 'end' : state.gameState
        })
      }

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
        let mobs = state.mobs
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

            // hide old tiles
            if (
              !changed &&
              item !== null &&
              item.display
            ) {
              item = createTile({hide: true})
              mobs = mobs.filter((mob, index) => {
                if (index === 0) {
                  return true
                }
                if (mob.position.x === x && mob.position.y === y) {
                  return false
                }

                return true
              })
            }
            return item
          })
        })

        if (shouldCreateMob && availableMobPositions.length > 0) {
          const key = Math.floor(Math.random() * availableMobPositions.length)
          const data = availableMobPositions[key]
          data.level = Math.ceil(Math.random() * state.mobs[0].level)
          if (data.x > 0 && data.y > 0) {
            mobs.push(createMob(data))
          }
        }

        return Object.assign({}, state, {world, mobs})
      }

    case reducerTypes.SET_GAME_STATE:
      return Object.assign({}, state, {
        gameState: action.state
      })

    default:
      return Object.assign({}, state)
  }
}

module.exports = {
  reducerTypes,
  reducers
}
