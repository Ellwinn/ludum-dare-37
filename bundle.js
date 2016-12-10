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

},{"./isRequired":8}],3:[function(require,module,exports){
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
  KEY_FOUR: 52
}

module.exports = constants

},{}],4:[function(require,module,exports){
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

},{"./bus":2,"./constants":3,"./mob":9,"./reducers":10}],5:[function(require,module,exports){
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

},{"./isRequired":8,"./render":11,"./update":12,"lb-loop":1}],6:[function(require,module,exports){
const game = require('./game')
const dataStore = require('./dataStore')
const input = require('./input')
const {
  TILE_SIZE,
  WORLD_WIDTH,
  WORLD_HEIGHT
} = require('./constants')

const init = () => {
  window.removeEventListener('DOMContentLoaded', init)

  const canvas = document.createElement('canvas')
  canvas.width = TILE_SIZE * WORLD_WIDTH
  canvas.height = TILE_SIZE * WORLD_HEIGHT

  const ctx = canvas.getContext('2d')

  game({canvas, ctx, dataStore})
  document.body.appendChild(canvas)
  input.start()
}

window.addEventListener('DOMContentLoaded', init)

},{"./constants":3,"./dataStore":4,"./game":5,"./input":7}],7:[function(require,module,exports){
// TODO get keys from constants

const handleKeyDown = event => {
  console.log('event', event.keyCode)
}

const start = () => {
  window.addEventListener('keydown', handleKeyDown)
}

const stop = () => {
  window.removeEventListener('keydown', handleKeyDown)
}

module.exports = {
  start,
  stop
}

},{}],8:[function(require,module,exports){
const isRequired = ({category = null, property = null} = {}) => {
  const prefix = category ? `[${category}] ` : ''
  const message = property ? `The property "${property}" is required` : 'Missing required property'
  throw new Error(prefix + message)
}

module.exports = isRequired

},{}],9:[function(require,module,exports){
const mobPrototype = {}

const createMob = ({x = 0, y = 0} = {}) => {
  const mob = Object.create(mobPrototype)
  mob.position = {x, y}

  return mob
}

module.exports = createMob

},{}],10:[function(require,module,exports){
const reducerTypes = {
  PLAYER_MOVE: 'PLAYER_MOVE'
}

const reducers = (state, action) => {
  switch (action.type) {
    default:
      return Object.assign({}, state)
  }
}

module.exports = {
  reducerTypes,
  reducers
}

},{}],11:[function(require,module,exports){
const isRequired = require('./isRequired')
const dataStore = require('./dataStore')
const {
  TILE_SIZE
} = require('./constants')

const expect = property => isRequired({
  property,
  category: 'render'
})

const createRender = ({
  canvas = expect('canvas'),
  ctx = expect('ctx')
} = {}) => {
  const state = dataStore.getState()

  state.world.forEach((row, y) => {
    row.forEach((item, x) => {
      ctx.fillStyle = `hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
    })
  })

  state.mobs.forEach(mob => {
    ctx.fillStyle = '#000'
    ctx.save()
    ctx.translate(mob.position.x * TILE_SIZE, mob.position.y * TILE_SIZE)
    ctx.fillRect(1, 1, 30, 30)
    ctx.restore()
  })

  return () => {
  }
}

module.exports = {
  createRender
}

},{"./constants":3,"./dataStore":4,"./isRequired":8}],12:[function(require,module,exports){
const isRequired = require('./isRequired')
const dataStore = require('./dataStore')

const expect = property => isRequired({
  property,
  category: 'update'
})

const createUpdate = ({
  canvas = expect('canvas'),
  ctx = expect('ctx')
} = {}) => {
  const state = dataStore.getState()
  console.log(state)

  return (time) => {
  }
}

module.exports = {
  createUpdate
}

},{"./dataStore":4,"./isRequired":8}]},{},[6]);
