const isRequired = require('./isRequired')

const collision = ({
  id = isRequired({category: 'collision', property: 'id'}),
  position = isRequired({category: 'collision', property: 'position'}),
  elements = isRequired({category: 'collision', property: 'elements'})
} = {}) => {
  return elements.reduce((ids, element) => {
    if (
      element.position.x === position.x &&
      element.position.y === position.y &&
      element.id !== id
    ) {
      ids.push(element.id)
    }
    return ids
  }, [])
}

module.exports = collision
