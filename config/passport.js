var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


var User            = require('../app/models/user');


passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    passReqToCallback : true
},
function(req, token, refreshToken, profile, done) {
    console.log('facebook:', profile)
    process.nextTick(function() {

        if (! req.user) {
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                if (err) { return done(err) }
                if (user) {

                    if (! user.facebook.token) {
                        user.facebook.token = token
                        user.facebook.name  = profile.displayName
                        user.save(function(err) {
                            if (err) { throw err }
                            return done(null, user)
                        })
                    }
                  
                    return done(null, user)
                } else {
                    
                    let newUser = new User()

                    newUser.facebook.id = profile.id
                    newUser.facebook.token = token
                    newUser.facebook.name  = profile.displayName
                    //newUser.facebook.email = profile.emails[0].value;
                    newUser.save(function(err) {
                        if (err) { throw err }
                        return done(null, newUser)
                    })
                }
            })
        } else {
            
            let user = req.user
            user.facebook.id = profile.id
            user.facebook.token = token
            user.facebook.name = profile.displayName
           

            user.save(function(err) {
                if (err) { throw err }
                return done(null, user)
            })
        }
    })
}))



