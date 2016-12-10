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

},{"./isRequired":6}],3:[function(require,module,exports){
const {createBus} = require('./bus')
const {reducers} = require('./reducers')

module.exports = createBus({reducers})

},{"./bus":2,"./reducers":7}],4:[function(require,module,exports){
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

},{"./isRequired":6,"./render":8,"./update":9,"lb-loop":1}],5:[function(require,module,exports){
const game = require('./game')
const dataStore = require('./dataStore')

const init = () => {
  window.removeEventListener('DOMContentLoaded', init)

  const canvas = document.createElement('canvas')
  canvas.width = 320
  canvas.height = 320

  const ctx = canvas.getContext('2d')

  game({canvas, ctx, dataStore})
  document.body.appendChild(canvas)
}

window.addEventListener('DOMContentLoaded', init)

},{"./dataStore":3,"./game":4}],6:[function(require,module,exports){
const isRequired = ({category = null, property = null} = {}) => {
  const prefix = category ? `[${category}] ` : ''
  const message = property ? `The property "${property}" is required` : 'Missing required property'
  throw new Error(prefix + message)
}

module.exports = isRequired

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
const isRequired = require('./isRequired')
const dataStore = require('./dataStore')

const expect = property => isRequired({
  property,
  category: 'render'
})

const createRender = ({
  canvas = expect('canvas'),
  ctx = expect('ctx')
} = {}) => {
  const state = dataStore.getState()
  console.log(state)

  return () => {
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}

module.exports = {
  createRender
}

},{"./dataStore":3,"./isRequired":6}],9:[function(require,module,exports){
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

},{"./dataStore":3,"./isRequired":6}]},{},[5]);