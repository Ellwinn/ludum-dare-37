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

const update = ({timePassed = 0} = {}) => {
  return {
    timePassed,
    type: reducerTypes.UPDATE
  }
}

const worldCreateTile = ({
  x = isRequired({category: 'worldCreateTile', property: 'x'}),
  y = isRequired({category: 'worldCreateTile', property: 'y'})
} = {}) => {
  return {
    x,
    y,
    type: reducerTypes.WORLD_CREATE_TILE
  }
}

const worldUpdate = () => {
  return {
    type: reducerTypes.WORLD_UPDATE
  }
}

module.exports = {
  mobMove,
  mobIdle,
  update,
  worldCreateTile,
  worldUpdate
}
