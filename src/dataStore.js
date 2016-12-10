const {createBus} = require('./bus')
const {reducers} = require('./reducers')

module.exports = createBus({reducers})
