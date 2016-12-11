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
      this.xpForLevelUp = 50 * this.level + 50
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
  mob.gold = level === 0 ? 0 : Math.floor(Math.random() * level)
  mob.level = level
  mob.xp = 0
  mob.xpForLevelUp = 50

  return mob
}

module.exports = createMob
