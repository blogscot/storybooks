const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../helpers/auth')

router.get('/', (req, res) => {
  res.render('stories')
})

router.get('/my', ensureAuthenticated, (req, res) => {
  res.render('stories/my')
})

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add')
})

module.exports = router
