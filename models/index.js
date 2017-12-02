const mongoose = require('mongoose')
const config = require('../config')

const debug = process.env.NODE_ENV !== 'production'

mongoose.set('debug', debug)
mongoose.Promise = global.Promise
mongoose.connect(config.mongoURI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true,
})

module.exports.User = require('./user')
module.exports.Story = require('./story')
