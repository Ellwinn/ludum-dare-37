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
