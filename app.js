const express = require('express')
const hbs = require('express-handlebars')

const app = express()

app.engine('handlebars', hbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Routes
app.get('/', (req, res) => {
  const title = 'Welcome'
  res.render('index', {
    title,
  })
})

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server available on http://localhost:${port}`)
})
