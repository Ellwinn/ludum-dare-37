const mobPrototype = {}

const createMob = ({x = 0, y = 0} = {}) => {
  const mob = Object.create(mobPrototype)
  mob.position = {x, y}

  return mob
}

module.exports = createMob
