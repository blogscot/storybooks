const mongoose = require('mongoose')
const mongo = require('../config/database')

mongoose.set('debug', true)
mongoose.Promise = global.Promise
mongoose.connect(mongo.URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true,
})
