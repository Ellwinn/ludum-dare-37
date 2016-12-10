const {
  NORTH,
  SOUTH,
  EAST,
  WEST,
  MOB_MOVE_STEPS
} = require('./constants')

const reducerTypes = {
  MOBS_UPDATE: 'MOBS_UPDATE',
  MOB_MOVE: 'MOB_MOVE'
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
            mob.active = true

            switch (action.direction) {
              case SOUTH: mob.position.y++; break
              case NORTH: mob.position.y--; break
              case EAST: mob.position.x++; break
              case WEST: mob.position.x--; break
            }

            mob.remainingSteps = MOB_MOVE_STEPS
            mob.direction = action.direction
          }
          return mob
        })
      })

    case reducerTypes.MOBS_UPDATE:
      return Object.assign({}, state, {
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

    default:
      return Object.assign({}, state)
  }
}

module.exports = {
  reducerTypes,
  reducers
}
