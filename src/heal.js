const isRequired = require('./isRequired')

const heal = (mob = isRequired({category: 'heal'})) => {
  mob.health += 1

  if (mob.health > mob.maxHealth) {
    mob.health = mob.maxHealth
  }
}

module.exports = heal
