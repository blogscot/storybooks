const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('stories')
})

router.get('/my', (req, res) => {
  res.render('stories/my')
})

module.exports = router
