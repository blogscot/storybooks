const GoogleStrategy = require('passport-google-oauth20').Strategy
const keys = require('./keys')
const db = require('../models')

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true,
      },
      (accessToken, refreshToken, profile, done) => {
        const imageURL = profile.photos[0].value.split('?')[0]
        const { id, emails, name: { givenName, familyName } } = profile
        const email = emails[0].value

        // Return and existing user info
        // or save current user details into DB
        db.User.findOne({ googleID: id }).then(user => {
          if (user) {
            done(null, user)
          } else {
            db
              .User({
                googleID: id,
                firstName: givenName,
                lastName: familyName,
                email,
                imageURL,
              })
              .save()
              .then(user => {
                done(null, user)
              })
          }
        })
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    db.User.findById(id).then(user => done(null, user))
  })
}
