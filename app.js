const express = require('express')
const hbs = require('express-handlebars')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const path = require('path')

const authRoutes = require('./routes/auth')
const mainRoutes = require('./routes')
const storyRoutes = require('./routes/stories')

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

app.engine('handlebars', hbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Global variables
app.use((req, res, next) => {
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
