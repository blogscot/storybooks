const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.redirect('/auth/verify')
})

module.exports = router
