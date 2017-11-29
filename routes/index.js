const express = require('express')
const router = express.Router()
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth')

// landing page for guests is `Welcome page`
// otherwise send logged-in users to the dashboard
router.get('/', ensureGuest, (req, res) => {
  res.render('home/welcome')
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('home/dashboard')
})

router.get('/about', (req, res) => {
  res.render('home/about')
})

module.exports = router
