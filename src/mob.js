const mobPrototype = {
  getSurroundingTiles () {
    const {x, y} = this.position
    const area = []
    const range = 3

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
