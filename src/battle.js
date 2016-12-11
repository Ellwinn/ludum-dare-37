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
