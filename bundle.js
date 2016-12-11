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

const setGameState = ({
  state = isRequired({category: 'setGameState', property: 'state'})
} = {}) => {
  return {
    state,
    type: reducerTypes.SET_GAME_STATE
  }
}

module.exports = {
  mobMove,
  mobIdle,
  update,
  worldCreateTile,
  worldUpdate,
  setGameState
}

},{"./isRequired":12,"./reducers":14}],3:[function(require,module,exports){
const isRequired = require('./isRequired')

const calculateAttackStrength = (mob) => {
  const attack = mob.attack
  const percentageHealth = mob.health / mob.maxHealth
  return Math.ceil(Math.random() * (attack * percentageHealth))
}

const battle = ([attacking, defending] = isRequired({category: 'battle'})) => {
  defending.health -= calculateAttackStrength(attacking)

  if (defending.health <= 0) {
    defending.health = 0

    attacking.gold += defending.gold
    attacking.xp += defending.maxHealth

    // TODO level up based on XP
  } else {
    attacking.health -= calculateAttackStrength(defending)

    if (attacking.health < 0) {
      attacking.health = 0
    }
  }

  return [attacking, defending]
}

module.exports = battle

},{"./isRequired":12}],4:[function(require,module,exports){
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

},{"./isRequired":12}],5:[function(require,module,exports){
const isRequired = require('./isRequired')

const collision = ({
  id = isRequired({category: 'collision', property: 'id'}),
  position = isRequired({category: 'collision', property: 'position'}),
  elements = isRequired({category: 'collision', property: 'elements'})
} = {}) => {
  return elements.reduce((ids, element) => {
    if (
      element.position.x === position.x &&
      element.position.y === position.y &&
      element.id !== id
    ) {
      ids.push(element.id)
    }
    return ids
  }, [])
}

module.exports = collision

},{"./isRequired":12}],6:[function(require,module,exports){
const constants = {
  TILE_SIZE: 4,
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
  VIEW_RANGE: 5,
  COLOR_RED: 'hsl(0, 50%, 50%)',
  COLOR_GREEN: 'hsl(80, 50%, 50%)'
}

module.exports = constants

},{}],7:[function(require,module,exports){
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
  ],
  gameState: 'start'
}

module.exports = createBus({reducers, defaultState})

},{"./bus":4,"./constants":6,"./mob":13,"./reducers":14}],8:[function(require,module,exports){
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
  ctx = expect('ctx'),
  dataStore = expect('dataStore'),
  hud = expect('hud')
} = {}) => {
  const update = createUpdate({canvas, ctx})
  const render = createRender({canvas, ctx, hud})

  const game = loop({
    update,
    render
  })

  game.start()

  return game
}

},{"./isRequired":12,"./render":15,"./update":17,"lb-loop":1}],9:[function(require,module,exports){
const isRequired = require('./isRequired')

const heal = (mob = isRequired({category: 'heal'})) => {
  mob.health += 1

  if (mob.health > mob.maxHealth) {
    mob.health = mob.maxHealth
  }
}

module.exports = heal

},{"./isRequired":12}],10:[function(require,module,exports){
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

  const hud = document.createElement('p')

  const canvas = document.createElement('canvas')
  canvas.width = TILE_SIZE * WORLD_WIDTH
  canvas.height = TILE_SIZE * WORLD_HEIGHT

  canvas.setAttribute('style', `width: ${canvas.width * 8}px;`)

  const ctx = canvas.getContext('2d')

  game({canvas, ctx, dataStore, hud})
  document.body.appendChild(canvas)

  const state = dataStore.getState()
  input.start(state.mobs[0].id)

  dataStore.dispatch(worldUpdate())

  hud.innerHTML = 'Press "enter" to start.'

  document.body.appendChild(hud)
}

window.addEventListener('DOMContentLoaded', init)

},{"./actions":2,"./constants":6,"./dataStore":7,"./game":8,"./input":11}],11:[function(require,module,exports){
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
  worldUpdate,
  setGameState
} = require('./actions')

const dataStore = require('./dataStore')

const handleKeyDown = event => {
  let updateWorld = false
  const state = dataStore.getState()

  if (event.keyCode === 13 && state.gameState === 'start') {
    dataStore.dispatch(setGameState({state: 'main'}))
  }

  if (event.keyCode === 13 && state.gameState === 'end') {
    window.location.reload()
  }

  if (state.gameState !== 'main') {
    return
  }

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

},{"./actions":2,"./constants":6,"./dataStore":7}],12:[function(require,module,exports){
const isRequired = ({category = null, property = null} = {}) => {
  const prefix = category ? `[${category}] ` : ''
  const message = property ? `The property "${property}" is required` : 'Missing required property'
  throw new Error(prefix + message)
}

module.exports = isRequired

},{}],13:[function(require,module,exports){
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

const createMob = ({x = 0, y = 0, level = 0} = {}) => {
  const mob = Object.create(mobPrototype)

  const health = 10 + (level * 2)

  mob.id = Math.random().toString(32).substring(2)
  mob.position = {x, y}
  mob.active = false
  mob.remainingSteps = 0
  mob.direction = null
  mob.health = health
  mob.maxHealth = health
  mob.attack = 1 + level
  mob.gold = level === 0 ? 0 : Math.floor(Math.random() * level)
  mob.xp = 0

  return mob
}

module.exports = createMob

},{"./constants":6}],14:[function(require,module,exports){
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
          const position = availableMobPositions[key]
          if (position.x > 0 && position.y > 0) {
            mobs.push(createMob(position))
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

},{"./battle":3,"./collision":5,"./constants":6,"./heal":9,"./mob":13,"./tile":16}],15:[function(require,module,exports){
const isRequired = require('./isRequired')
const dataStore = require('./dataStore')
const {
  TILE_SIZE,
  NORTH,
  SOUTH,
  EAST,
  WEST,
  MOB_MOVE_STEPS,
  TILE_DISPLAY_STEPS,
  COLOR_RED,
  COLOR_GREEN
} = require('./constants')

const expect = property => isRequired({
  property,
  category: 'render'
})

const createRender = ({
  canvas = expect('canvas'),
  ctx = expect('ctx'),
  hud = expect('hud')
} = {}) => {
  return () => {
    const state = dataStore.getState()

    switch (state.gameState) {
      case 'start':
        // do nothing
        break
      case 'end':
        ctx.fillStyle = COLOR_RED
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        hud.innerHTML = `
          You died with ${state.mobs[0].gold} gold<br/>
          Press "enter" to try again
        `
        break
      default:
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        state.world.forEach((row, y) => {
          row.forEach((item, x) => {
            if (item !== null) {
              const alpha = item.display ? (
                1 - (item.remainingSteps / TILE_DISPLAY_STEPS)
              ) : (
                item.remainingSteps / TILE_DISPLAY_STEPS
              )
              // ctx.fillStyle = `hsla(200, 50%, 50%, ${alpha})`
              ctx.fillStyle = item.color
                .replace(/^hsl/, 'hsla')
                .replace(/\)$/, `, ${alpha})`)
              ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
            }
          })
        })

        state.mobs.forEach((mob, index) => {
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

          ctx.save()
          ctx.translate(x, y)
          ctx.fillStyle = `hsl(${index === 0 ? 170 : 350}, 50%, 50%)`
          ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

          const percentageHealth = mob.health / mob.maxHealth
          const percentWidth = Math.floor(percentageHealth * TILE_SIZE)
          ctx.fillStyle = COLOR_GREEN
          ctx.fillRect(0, 0, percentWidth, 1)
          ctx.fillStyle = COLOR_RED
          ctx.fillRect(percentWidth, 0, TILE_SIZE - percentWidth, 1)
          ctx.restore()
        })

        const player = state.mobs[0]
        hud.innerHTML = `
          Health: ${player.health}/${player.maxHealth}
          Attack: ${player.attack}
          Gold: ${player.gold}
          XP: ${player.xp}
        `
        break
    }
  }
}

module.exports = {
  createRender
}

},{"./constants":6,"./dataStore":7,"./isRequired":12}],16:[function(require,module,exports){
const {TILE_DISPLAY_STEPS} = require('./constants')

const createTile = ({hide = false} = {}) => {
  return {
    display: !hide,
    remainingSteps: TILE_DISPLAY_STEPS,
    color: `hsl(${Math.floor(Math.random() * 10 + 180)}, 50%, 30%)`
  }
}

module.exports = createTile

},{"./constants":6}],17:[function(require,module,exports){
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

},{"./actions":2,"./dataStore":7,"./isRequired":12}]},{},[10]);
