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
