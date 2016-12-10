const isRequired = require('./isRequired')
const {reducerTypes} = require('./reducers')

const mobMove = ({
  direction = null,
  id = isRequired({
    category: 'mobMove',
    property: 'id'
  })
} = {}) => {
  return {
    id,
    direction,
    type: reducerTypes.MOB_MOVE
  }
}

const mobIdle = ({
  id = isRequired({
    category: 'mobIdle',
    property: 'id'
  })
} = {}) => {
  return {
    id,
    type: reducerTypes.MOB_IDLE
  }
}

const mobsUpdate = ({timePassed = 0} = {}) => {
  return {
    timePassed,
    type: reducerTypes.MOBS_UPDATE
  }
}

module.exports = {
  mobMove,
  mobIdle,
  mobsUpdate
}
