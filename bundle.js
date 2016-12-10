(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _this = this;

var loop = (function () {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var update = _ref.update;
  var render = _ref.render;
  var _ref$fps = _ref.fps;
  var fps = _ref$fps === undefined ? 1000 / 60 : _ref$fps;

  var errorType = null;
  var state = {
    mode: 'stopped',
    startTime: new Date().getTime(),
    timeSinceLastUpdate: 0,
    frameTime: fps
  };

  if (!update && !render) {
    errorType = 'You must declare an update and a render function when creating a new loop';
  } else if (!update) {
    errorType = 'You must declare an update function when creating a new loop';
  } else if (!render) {
    errorType = 'You must declare a render function when creating a new loop';
  }

  if (errorType) {
    throw new Error(errorType);
  }

  var tick = function tick(timestamp) {
    window.requestAnimationFrame(function (rafTimestamp) {
      tick(rafTimestamp);
    });

    var timePassed = new Date().getTime() - state.startTime;
    var delta = timestamp - timePassed;

    state.timeSinceLastUpdate += delta;

    if (state.timeSinceLastUpdate >= state.frameTime) {
      update(state.timeSinceLastUpdate);
      state.timeSinceLastUpdate = 0;
    }

    render();
  };

  return Object.create({
    start: function start() {
      state.mode = 'playing';
      state.startTime = new Date().getTime();
      state.timeSinceLastUpdate = 0;
      tick(0);
      return _this;
    },
    stop: function stop() {
      state.mode = 'stopped';
      return _this;
    },
    pause: function pause() {
      state.mode = 'paused';
      return _this;
    }
  });
})

module.exports = loop;
},{}],2:[function(require,module,exports){
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

},{"./isRequired":9,"./reducers":11}],3:[function(require,module,exports){
const isRequired = require('./isRequired')

const createBus = ({
  reducers = isRequired({
    category: 'createBus',
    property: 'reducers'
  }),
  defaultState = {}
} = {}) => {
  let state = Object.assign({}, defaultState)
  const subscriptions = []

  const getState = () => state

  const subscribe = (callback) => {
    const id = Math.random().toString(36).substring(2)
    subscriptions.push({id, callback})
    return id
  }

  const dispatch = (action) => {
    if (!action || !action.type) {
      throw new Error('dispatch requires an object with a type property')
    }

    state = reducers(state, action)

    subscriptions.forEach(subscription => {
      subscription.callback()
    })
  }

  const reset = () => {
    state = Object.assign({}, defaultState)

    subscriptions.forEach(subscription => {
      subscription.callback()
    })
  }

  return {
    getState,
    subscribe,
    dispatch,
    reset
  }
}

module.exports = {
  createBus
}

},{"./isRequired":9}],4:[function(require,module,exports){
const constants = {
  TILE_SIZE: 32,
  WORLD_WIDTH: 15,
  WORLD_HEIGHT: 11,
  KEY_LEFT: 37,
  KEY_RIGHT: 39,
  KEY_UP: 38,
  KEY_DOWN: 40,
  KEY_ONE: 49,
  KEY_TWO: 50,
  KEY_THREE: 51,
  KEY_FOUR: 52,
  NORTH: 'NORTH',
  SOUTH: 'SOUTH',
  EAST: 'EAST',
  WEST: 'WEST',
  MOB_MOVE_STEPS: 500,
  TILE_DISPLAY_STEPS: 1000,
  VIEW_RANGE: 5
}

module.exports = constants

},{}],5:[function(require,module,exports){
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
  ]
}

module.exports = createBus({reducers, defaultState})

},{"./bus":3,"./constants":4,"./mob":10,"./reducers":11}],6:[function(require,module,exports){
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

},{"./isRequired":9,"./render":12,"./update":14,"lb-loop":1}],7:[function(require,module,exports){
const game = require('./game')
const dataStore = require('./dataStore')
const input = require('./input')

const {
  TILE_SIZE,
  WORLD_WIDTH,
  WORLD_HEIGHT
} = require('./constants')

const {
  worldUpdate
} = require('./actions')

const init = () => {
  window.removeEventListener('DOMContentLoaded', init)

  const canvas = document.createElement('canvas')
  canvas.width = TILE_SIZE * WORLD_WIDTH
  canvas.height = TILE_SIZE * WORLD_HEIGHT

  const ctx = canvas.getContext('2d')

  game({canvas, ctx, dataStore})
  document.body.appendChild(canvas)

  const state = dataStore.getState()
  input.start(state.mobs[0].id)

  dataStore.dispatch(worldUpdate())
}

window.addEventListener('DOMContentLoaded', init)

},{"./actions":2,"./constants":4,"./dataStore":5,"./game":6,"./input":8}],8:[function(require,module,exports){
let playerId = null

const {
  NORTH,
  SOUTH,
  EAST,
  WEST,
  KEY_LEFT,
  KEY_RIGHT,
  KEY_UP,
  KEY_DOWN,
  KEY_ONE,
  KEY_TWO,
  KEY_THREE,
  KEY_FOUR
} = require('./constants')

const {
  mobMove,
  worldUpdate
} = require('./actions')
const dataStore = require('./dataStore')

const handleKeyDown = event => {
  let updateWorld = false

  switch (event.keyCode) {
    case KEY_LEFT:
      dataStore.dispatch(mobMove({
        direction: WEST,
        id: playerId
      }))
      updateWorld = true
      break
    case KEY_RIGHT:
      dataStore.dispatch(mobMove({
        direction: EAST,
        id: playerId
      }))
      updateWorld = true
      break
    case KEY_UP:
      dataStore.dispatch(mobMove({
        direction: NORTH,
        id: playerId
      }))
      updateWorld = true
      break
    case KEY_DOWN:
      dataStore.dispatch(mobMove({
        direction: SOUTH,
        id: playerId
      }))
      updateWorld = true
      break
    case KEY_ONE:
    case KEY_TWO:
    case KEY_THREE:
    case KEY_FOUR:
      console.log('action button pressed')
      break
  }

  if (updateWorld) {
    dataStore.dispatch(worldUpdate())
  }
}

const start = (id) => {
  playerId = id
  window.addEventListener('keydown', handleKeyDown)
}

const stop = () => {
  window.removeEventListener('keydown', handleKeyDown)
}

module.exports = {
  start,
  stop
}

},{"./actions":2,"./constants":4,"./dataStore":5}],9:[function(require,module,exports){
const isRequired = ({category = null, property = null} = {}) => {
  const prefix = category ? `[${category}] ` : ''
  const message = property ? `The property "${property}" is required` : 'Missing required property'
  throw new Error(prefix + message)
}

module.exports = isRequired

},{}],10:[function(require,module,exports){
const {VIEW_RANGE} = require('./constants')

const mobPrototype = {
  getSurroundingTiles () {
    const {x, y} = this.position
    const area = []
    const range = VIEW_RANGE

    for (let i = -range; i <= range; i++) {
      for (let j = -range; j <= range; j++) {
        const xSteps = Math.abs(j)
        const ySteps = Math.abs(i)
        const distance = xSteps + ySteps

        if (distance <= range) {
          area.push({
            x: j + x,
            y: i + y
          })
        }
      }
    }

    return area
  }
}

const createMob = ({x = 0, y = 0} = {}) => {
  const mob = Object.create(mobPrototype)

  mob.id = Math.random().toString(32).substring(2)
  mob.position = {x, y}
  mob.active = false
  mob.remainingSteps = 0
  mob.direction = null

  return mob
}

module.exports = createMob

},{"./constants":4}],11:[function(require,module,exports){
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
        const activeTiles = state.mobs[0].getSurroundingTiles()
        return Object.assign({}, state, {
          world: state.world.map((rows, y) => {
            return rows.map((item, x) => {
              let changed = false
              /*
              if (item !== null && item.display !== false) {
                item = createTile({hide: true})
              }
              */
              activeTiles.forEach(tile => {
                if (x === tile.x && y === tile.y) {
                  changed = true
                  if (
                    item === null ||
                    (item.remainingSteps <= 0 && item.display === false)
                  ) {
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
        })
      }

    default:
      return Object.assign({}, state)
  }
}

module.exports = {
  reducerTypes,
  reducers
}

},{"./constants":4,"./tile":13}],12:[function(require,module,exports){
const isRequired = require('./isRequired')
const dataStore = require('./dataStore')
const {
  TILE_SIZE,
  NORTH,
  SOUTH,
  EAST,
  WEST,
  MOB_MOVE_STEPS,
  TILE_DISPLAY_STEPS
} = require('./constants')

const expect = property => isRequired({
  property,
  category: 'render'
})

const createRender = ({
  canvas = expect('canvas'),
  ctx = expect('ctx')
} = {}) => {
  return () => {
    const state = dataStore.getState()

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    state.world.forEach((row, y) => {
      row.forEach((item, x) => {
        if (item !== null) {
          const alpha = item.display ? (
            1 - (item.remainingSteps / TILE_DISPLAY_STEPS)
          ) : (
            item.remainingSteps / TILE_DISPLAY_STEPS
          )
          ctx.fillStyle = `hsla(200, 50%, 50%, ${alpha})`
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        }
      })
    })

    state.mobs.forEach(mob => {
      let x = mob.position.x * TILE_SIZE
      let y = mob.position.y * TILE_SIZE

      if (mob.active && mob.remainingStops !== 0) {
        const offset = (mob.remainingSteps / MOB_MOVE_STEPS) * TILE_SIZE
        switch (mob.direction) {
          case NORTH:
            y += offset
            break
          case SOUTH:
            y -= offset
            break
          case EAST:
            x -= offset
            break
          case WEST:
            x += offset
            break
        }
      }

      ctx.fillStyle = '#000'
      ctx.save()
      ctx.translate(x, y)
      ctx.fillRect(1, 1, 30, 30)
      ctx.restore()
    })
  }
}

module.exports = {
  createRender
}

},{"./constants":4,"./dataStore":5,"./isRequired":9}],13:[function(require,module,exports){
const {TILE_DISPLAY_STEPS} = require('./constants')

const createTile = ({hide = false} = {}) => {
  return {
    display: !hide,
    remainingSteps: TILE_DISPLAY_STEPS
  }
}

module.exports = createTile

},{"./constants":4}],14:[function(require,module,exports){
const isRequired = require('./isRequired')
const dataStore = require('./dataStore')
const {update} = require('./actions')

const expect = property => isRequired({
  property,
  category: 'update'
})

const createUpdate = ({
  canvas = expect('canvas'),
  ctx = expect('ctx')
} = {}) => {
  return timePassed => {
    dataStore.dispatch(update({timePassed}))
  }
}

module.exports = {
  createUpdate
}

},{"./actions":2,"./dataStore":5,"./isRequired":9}]},{},[7]);
