const express = require('express')
const hbs = require('express-handlebars')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const path = require('path')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// Routes
const authRoutes = require('./routes/auth')
const mainRoutes = require('./routes')
const storyRoutes = require('./routes/stories')

// Helpers
const {
  convertMarkdown,
  formatDate,
  truncate,
  select,
  stripTags,
} = require('./helpers/hbs')

// Set up Passport
require('./config/passport')(passport)

const app = express()

// Middleware

// Configuration for static css and images files
app.use(express.static(path.join(__dirname, '/')))

app.use(cookieParser())

app.use(
  session({
    secret: 'wedD291oc92n39dlkps%ah*434',
    resave: true,
    saveUninitialized: true,
  })
)

// Use Passport middleware after sesssion setup
app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

app.engine(
  'handlebars',
  hbs({
    defaultLayout: 'main',
    helpers: {
      convertMarkdown,
      formatDate,
      truncate,
      select,
      stripTags,
    },
  })
)
app.set('view engine', 'handlebars')

app.use(flash())

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

// Routes
app.use('/', mainRoutes)
app.use('/auth', authRoutes)
app.use('/stories', storyRoutes)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server available on http://localhost:${port}`)
})
