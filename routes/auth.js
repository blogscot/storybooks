const express = require('express')
const router = express.Router()
const passport = require('passport')

const db = require('../models')

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/dashboard')
  }
)

router.get('/verify', (req, res) => {
  if (req.user) {
    console.log(req.user)
  } else {
    console.log('Not Authenticated.')
  }
  res.redirect('/')
})

module.exports = router
