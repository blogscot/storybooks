const mongoose = require('mongoose')
const mongo = require('../config/database')

const debug = process.env.NODE_ENV !== 'production'

mongoose.set('debug', debug)
mongoose.Promise = global.Promise
mongoose.connect(mongo.URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true,
})

module.exports.User = require('./user')
