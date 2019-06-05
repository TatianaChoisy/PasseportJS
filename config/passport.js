var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


   
    // function(req, email, password, done){
    //     process.nextTick(function(){
    //         User.findOne({ 'local.username': email}, function(err, user){
    //             if(err)
    //                 return done(err);
    //             if(!user)
    //                 return done(null, false, req.flash('loginMessage', 'No User found'));
    //             if(user.local.password != password){
    //                 return done(null, false, req.flash('loginMessage', 'inavalid password'));
    //             }
    //             return done(null, user);

    //         });
    //     });
    // }





    passport.use('local-signup', new LocalStrategy({
	
        function(username, password, done) {
            process.nextTick(function () {
                User.findOne({ username: username }, function (err, user) {
                    if (err)
                        return done(err);
                    if (!user) {
                        return done(null, false, req.flash('signupMessage', 'That email already taken'));
                    } else {
                        var newUser = new User();
                        newUser.local.username = username;
                        newUser.local.password = username;

                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        })
                    }
                })

            });
        }
    }));

    passport.use(new FacebookStrategy({
        function(req, token, refreshToken, profile, done) {
            console.log('facebook:', profile)
            process.nextTick(function () {

                if (!req.user) {
                    User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                        if (err) { return done(err) }
                        if (user) {

                            if (!user.facebook.token) {
                                user.facebook.token = token
                                user.facebook.name = profile.displayName
                                user.save(function (err) {
                                    if (err) { throw err }
                                    return done(null, user)
                                })
                            }

                            return done(null, user)
                        } else {

                            let newUser = new User()

                            newUser.facebook.id = profile.id
                            newUser.facebook.token = token
                            newUser.facebook.name = profile.displayName
                            //newUser.facebook.email = profile.emails[0].value;
                            newUser.save(function (err) {
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


                    user.save(function (err) {
                        if (err) { throw err }
                        return done(null, user)
                    })
                }
            })


        }

    }));
}
