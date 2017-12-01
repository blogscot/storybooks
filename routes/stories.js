const express = require('express')
const router = express.Router()

const { ensureAuthenticated } = require('../helpers/auth')
const db = require('../models')

router.get('/', (req, res) => {
  db.Story.find({ status: 'public' })
    .populate('user')
    .then(stories => {
      res.render('stories', { stories })
    })
})

router.get('/my', ensureAuthenticated, (req, res) => {
  res.render('stories/my')
})

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add')
})

router.get('/show/:id', (req, res) => {
  const { id } = req.params
  db.Story.findOne({ _id: id })
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
      res.render('stories/show', { story })
    })
})

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  const { id } = req.params
  db.Story.findOne({ _id: id }).then(story => {
    res.render('stories/edit', { story })
  })
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
      res.redirect(`/stories/user/${user}`)
    })
    .catch(err => {
      req.flash('error_msg', 'A problem occurred while saving story')
      res.redirect('/stories/add')
    })
})

router.put('/:id', ensureAuthenticated, (req, res) => {
  const { id } = req.params
  const { allowedComments, contents, status, title } = req.body
  db.Story.findByIdAndUpdate(
    { _id: id },
    {
      title,
      contents,
      status,
      allowedComments: allowedComments === 'on',
    },
    () => {
      req.flash('success_msg', 'Story updated')
      res.redirect('/dashboard')
    }
  )
})

router.delete('/:id', ensureAuthenticated, (req, res) => {
  const { id } = req.params
  db.Story.findByIdAndRemove({ _id: id }, () => {
    req.flash('success_msg', 'Story removed')
    res.redirect('/dashboard')
  })
})

router.get('/user/:id', ensureAuthenticated, (req, res) => {
  const { id } = req.params
  db.Story.find({ user: id })
    .populate('user')
    .then(stories => {
      res.render('stories/my', { stories })
    })
})

// For MongoDB operators see reference:
// https://docs.mongodb.com/manual/reference/operator/

router.post('/comment/:id', ensureAuthenticated, (req, res) => {
  const { id } = req.params
  const { commentBody } = req.body
  const { id: commentUser } = req.user

  db.Story.findByIdAndUpdate(
    { _id: id },
    {
      $push: {
        comments: {
          commentBody,
          commentUser,
        },
      },
    },
    () => {
      req.flash('success_msg', 'Comment added')
      res.redirect(`/stories/show/${id}`)
    }
  )
})

module.exports = router
