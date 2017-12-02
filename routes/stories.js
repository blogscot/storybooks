const express = require('express')
const router = express.Router()

const { ensureAuthenticated } = require('../helpers/auth')
const db = require('../models')

// Public stories
router.get('/', (req, res) => {
  db.Story.find({ status: 'public' })
    .populate('user')
    .sort({ date: 'desc' })
    .then(stories => {
      res.render('stories', { stories })
    })
})

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add')
})

router.get('/show/:id', ensureAuthenticated, (req, res) => {
  const { id } = req.params
  db.Story.findOne({ _id: id })
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
      // only story owners can see their private or unpublished stories
      if (story.user.id === req.user.id || story.status === 'public') {
        res.render('stories/show', { story })
      } else {
        res.redirect('/dashboard')
      }
    })
})

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  const { id } = req.params
  db.Story.findOne({ _id: id })
    .populate('user')
    .then(story => {
      // Only story owners can edit their stories
      if (story.user.id === req.user.id) {
        res.render('stories/edit', { story })
      } else {
        res.redirect('/stories')
      }
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
      res.redirect(`/stories/my`)
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
  const { id: _id } = req.params
  db.Story.findOne({ _id })
    .populate('user')
    .then(story => {
      // Only the story owner can delete a story
      if (story.user.id === req.user.id) {
        db.Story.remove({ _id }).then(() => {
          req.flash('success_msg', 'Story removed')
          res.redirect('/dashboard')
        })
      } else {
        res.redirect('/dashboard')
      }
    })
})

router.get('/user/:id', ensureAuthenticated, (req, res) => {
  const { id } = req.params
  db.Story.find({ user: id, status: 'public' })
    .populate('user')
    .then(stories => {
      res.render('stories/user', { stories })
    })
})

router.get('/my', ensureAuthenticated, (req, res) => {
  const { id } = req.user
  db.Story.find({ user: id })
    .populate('user')
    .then(stories => {
      res.render('stories/user', { stories })
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
