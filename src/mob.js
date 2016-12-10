const createMob = ({x = 0, y = 0} = {}) => {
  return {
    id: Math.random().toString(32).substring(2),
    position: {x, y},
    active: false,
    remainingSteps: 0,
    direction: null
  }
}

module.exports = createMob
