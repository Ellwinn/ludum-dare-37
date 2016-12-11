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

},{"./isRequired":13,"./reducers":15}],3:[function(require,module,exports){
const isRequired = require('./isRequired')
const battle = require('./battle')

const ai = ([player, enemy] = isRequired({category: 'ai'}), mobs) => {
  const targetPosition = player.position
  const currentPosition = {
    x: enemy.position.x,
    y: enemy.position.y
  }
  const xDistance = targetPosition.x - currentPosition.x
  const yDistance = targetPosition.y - currentPosition.y

  let moveOnXAxis = true

  if (Math.abs(xDistance) + Math.abs(yDistance) <= 1) {
    return
  }

  if (xDistance === 0) {
    moveOnXAxis = false
  }

  if (yDistance !== 0) {
    moveOnXAxis = Math.random() > 0.5
  }

  if (moveOnXAxis) {
    enemy.position.x += xDistance > 0 ? 1 : -1
  } else {
    enemy.position.y += yDistance > 0 ? 1 : -1
  }

  if (Math.abs(enemy.position.x - player.position.x) + Math.abs(enemy.position.y - player.position.y) === 1) {
    battle([enemy, player])
  }

  if (enemy.position.x === player.position.x && enemy.position.y === player.position.y) {
    // reverse move
    if (moveOnXAxis) {
      enemy.position.x += xDistance > 0 ? -1 : 1
    } else {
      enemy.position.y += yDistance > 0 ? -1 : 1
    }
  }

  let reset = false
  mobs.forEach(compare => {
    if (
      compare.position.x === enemy.position.x &&
      compare.position.y === enemy.position.y &&
      compare.id !== enemy.id
    ) {
      reset = true
    }
  })

  if (reset) {
    enemy.position = currentPosition
  }
}

module.exports = ai

},{"./battle":4,"./isRequired":13}],4:[function(require,module,exports){
const isRequired = require('./isRequired')
const sound = require('./sound')

const calculateAttackStrength = (mob) => {
  const attack = mob.attack
  const percentageHealth = mob.health / mob.maxHealth
  return Math.ceil(Math.random() * (attack * percentageHealth))
}

const battle = ([attacking, defending] = isRequired({category: 'battle'})) => {
  defending.health -= calculateAttackStrength(attacking)
  sound.attack()

  if (defending.health <= 0) {
    sound.die()
    defending.health = 0

    attacking.gold += defending.gold
    attacking.xp += defending.maxHealth

    attacking.levelUp()
  } else {
    attacking.health -= calculateAttackStrength(defending)

    if (attacking.health < 0) {
      sound.die()
      attacking.health = 0
    }
  }

  return [attacking, defending]
}

module.exports = battle

},{"./isRequired":13,"./sound":17}],5:[function(require,module,exports){
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

},{"./isRequired":13}],6:[function(require,module,exports){
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

},{"./isRequired":13}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"./bus":5,"./constants":7,"./mob":14,"./reducers":15}],9:[function(require,module,exports){
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

},{"./isRequired":13,"./render":16,"./update":19,"lb-loop":1}],10:[function(require,module,exports){
const isRequired = require('./isRequired')

const heal = (mob = isRequired({category: 'heal'})) => {
  mob.health += 1

  if (mob.health > mob.maxHealth) {
    mob.health = mob.maxHealth
  }
}

module.exports = heal

},{"./isRequired":13}],11:[function(require,module,exports){
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

  hud.innerHTML = `
  Press "enter" to start.
  <br/>Current highscore ${window.localStorage.getItem('maxGold') || 0} gold
  `

  document.body.appendChild(hud)

  const rules = document.createElement('p')
  rules.innerHTML = `
  Use the arrow keys to move. Stay alive and get as much gold as you can.
  To attack just move in the direction of the enemy player.
  `
  document.body.appendChild(rules)
}

window.addEventListener('DOMContentLoaded', init)

},{"./actions":2,"./constants":7,"./dataStore":8,"./game":9,"./input":12}],12:[function(require,module,exports){
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

const sound = require('./sound')

const handleKeyDown = event => {
  let updateWorld = false
  const state = dataStore.getState()

  if (event.keyCode === 13 && state.gameState === 'start') {
    dataStore.dispatch(setGameState({state: 'main'}))
  }

  if (event.keyCode === 13 && state.gameState === 'end') {
    const maxGold = window.localStorage.getItem('maxGold') || 0

    if (state.mobs[0].gold > maxGold) {
      window.localStorage.setItem('maxGold', state.mobs[0].gold)
    }
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
    sound.walk()
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

},{"./actions":2,"./constants":7,"./dataStore":8,"./sound":17}],13:[function(require,module,exports){
const isRequired = ({category = null, property = null} = {}) => {
  const prefix = category ? `[${category}] ` : ''
  const message = property ? `The property "${property}" is required` : 'Missing required property'
  throw new Error(prefix + message)
}

module.exports = isRequired

},{}],14:[function(require,module,exports){
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
  },
  levelUp () {
    if (this.xp >= this.xpForLevelUp) {
      this.level += 1

      const health = 10 + (this.level * 2)

      this.health = health
      this.maxHealth = health
      this.attack = this.level + 1
      this.xpForLevelUp = 30 * this.level + 30
    }
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
  mob.gold = level === 0 ? 1 : Math.floor(Math.random() * level)
  mob.level = level
  mob.xp = 0
  mob.xpForLevelUp = 30

  return mob
}

module.exports = createMob

},{"./constants":7}],15:[function(require,module,exports){
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
const ai = require('./ai')

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
        mobs: state.mobs.map((mob, index) => {
          if (index !== 0) {
            ai([state.mobs[0], mob], state.mobs)
          }

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

},{"./ai":3,"./battle":4,"./collision":6,"./constants":7,"./heal":10,"./mob":14,"./tile":18}],16:[function(require,module,exports){
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

},{"./constants":7,"./dataStore":8,"./isRequired":13}],17:[function(require,module,exports){
/* globals AudioContext */

const sound = () => {
  let active = false

  const audioContext = new AudioContext()
  const hudContext = new AudioContext()

  const noiseBuffer = () => {
    const bufferSize = audioContext.sampleRate
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)

    let output = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    return buffer
  }

  const attack = () => {
    if (!active) {
      active = true
      const startTime = audioContext.currentTime
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()

      oscillator.connect(gain)
      gain.connect(audioContext.destination)

      gain.gain.setValueAtTime(1, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5)

      oscillator.frequency.setValueAtTime(150, startTime)
      oscillator.frequency.exponentialRampToValueAtTime(0.001, startTime + 0.5)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.5)

      setTimeout(() => {
        active = false
      }, 200)
    }
  }

  const walk = () => {
    if (!active) {
      active = true
      const startTime = audioContext.currentTime
      const noise = audioContext.createBufferSource()
      noise.buffer = noiseBuffer(audioContext)

      const noiseFilter = audioContext.createBiquadFilter()
      noiseFilter.type = 'highpass'
      // noiseFilter.frequency.value = 1000
      noiseFilter.frequency.value = 5000
      noise.connect(noiseFilter)

      const noiseEnvelope = audioContext.createGain()
      noiseFilter.connect(noiseEnvelope)

      noiseEnvelope.connect(audioContext.destination)

      const osc = audioContext.createOscillator()
      osc.type = 'triangle'

      const oscEnvelope = audioContext.createGain()
      osc.connect(oscEnvelope)

      oscEnvelope.connect(audioContext.destination)

      noiseEnvelope.gain.setValueAtTime(1, startTime)
      noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2)

      noise.start(startTime)

      osc.frequency.setValueAtTime(100, startTime)
      oscEnvelope.gain.setValueAtTime(0.7, startTime)
      oscEnvelope.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1)

      osc.start(startTime)

      osc.stop(startTime + 0.2)
      noise.stop(startTime + 0.2)

      setTimeout(() => {
        active = false
      }, 200)
    }
  }

  const die = () => {
    const startTime = hudContext.currentTime
    const oscillator = hudContext.createOscillator()
    const gain = hudContext.createGain()

    oscillator.connect(gain)
    gain.connect(hudContext.destination)

    gain.gain.setValueAtTime(1, startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 5)

    oscillator.frequency.setValueAtTime(200, startTime)
    oscillator.frequency.exponentialRampToValueAtTime(0.01, startTime + 5)

    oscillator.start(startTime)
    oscillator.stop(startTime + 5)
  }

  const gameOver = () => {
    const startTime = hudContext.currentTime
    const oscillator = hudContext.createOscillator()
    const gain = hudContext.createGain()

    oscillator.connect(gain)
    gain.connect(hudContext.destination)

    gain.gain.setValueAtTime(1, startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5)

    oscillator.frequency.setValueAtTime(1000, startTime)
    oscillator.frequency.exponentialRampToValueAtTime(100, startTime + 0.5)

    oscillator.start(startTime)
    oscillator.stop(startTime + 0.5)
  }

  return {
    attack,
    walk,
    die,
    gameOver
  }
}

module.exports = sound()

},{}],18:[function(require,module,exports){
const {TILE_DISPLAY_STEPS} = require('./constants')

const createTile = ({hide = false} = {}) => {
  return {
    display: !hide,
    remainingSteps: TILE_DISPLAY_STEPS,
    color: `hsl(${Math.floor(Math.random() * 10 + 180)}, 50%, 30%)`
  }
}

module.exports = createTile

},{"./constants":7}],19:[function(require,module,exports){
const isRequired = require('./isRequired')
const dataStore = require('./dataStore')
const {update} = require('./actions')

const sound = require('./sound')

const expect = property => isRequired({
  property,
  category: 'update'
})

const createUpdate = ({
  canvas = expect('canvas'),
  ctx = expect('ctx')
} = {}) => {
  let triggered = false

  return timePassed => {
    const state = dataStore.getState()

    if (state.gameState === 'end' && !triggered) {
      triggered = true
      sound.gameOver()
    } else {
      dataStore.dispatch(update({timePassed}))
    }
  }
}

module.exports = {
  createUpdate
}

},{"./actions":2,"./dataStore":8,"./isRequired":13,"./sound":17}]},{},[11]);
