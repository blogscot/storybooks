const express = require('express')
const router = express.Router()
const convertMarkdown = require('../helpers/stories')

const { ensureAuthenticated } = require('../helpers/auth')
const db = require('../models')

router.get('/', (req, res) => {
  db.Story.find({ status: 'public' })
    .populate('user')
    .then(stories => {
      const converted = convertMarkdown(stories)
      res.render('stories', { stories: converted })
    })
})

router.get('/my', ensureAuthenticated, (req, res) => {
  res.render('stories/my')
})

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add')
})

router.post('/', ensureAuthenticated, (req, res) => {
  const { allowedComments, contents, status, title } = req.body
  const { id: user } = req.user

  db
    .Story({
      title,
      contents,
      status,
      allowedComments: allowedComments === 'on',
      user,
    })
    .save()
    .then(story => {
      req.flash('success_msg', `Story added`)
      res.redirect('/stories/my')
    })
    .catch(err => {
      req.flash('error_msg', 'A problem occurred while saving story')
      res.redirect('/story/add')
    })
})

module.exports = router
