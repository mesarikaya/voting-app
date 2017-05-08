'use strict';

//var FacebookStrategy = require('passport-facebook').Strategy;
//var TwitterStrategy = require('passport-twitter').Strategy;
//var GithubStrategy = require('passport-github2').Strategy;
//var InstagramStrategy = require('passport-instagram').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var User = require('../Model/user');
var configAuth = require('./oauth');

module.exports = function (passport) {
    //console.log("Client Id is: ", configAuth.googleAuth);
    // config
    passport.serializeUser(function(user, done) {
      //console.log('serializeUser: ' + user.id);
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user){
          //console.log(user);
          if(!err) done(null, user);
          else done(err, null);
        });
    });
    
    
    
    passport.use(new GoogleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL
      },
      function(accessToken, refreshToken, profile, done) {
        		process.nextTick(function () {
                      User.findOne({ oauthID: profile.id }, function(err, user) {
                          				if (err) {
                          					return done(err);
                          				}
                          
                          				if (user) {
                          					return done(null, user);
                          				} 
                          				else {
                          					var newUser = new User();
                          					//console.log("Profile is:", profile);
                                    // Initiate the user details
                          					newUser.google.oauthID = profile.id;
                          					newUser.google.name = profile.displayName;
                          					newUser.google.created = Date.now();
                          					newUser.poll_data = { 'Poll_name': "",
                                                          'Questions' : [],
                                                          'Votes' : {}
                          					              			};
                                    
                                    //Save the user into the database
                          					newUser.save(function (err) {
                          						if (err) {
                          							throw err;
                          						}
                          						return done(null, newUser);
                          					});
                          				}
                      });
        		});
        }
    ));
    
};
    
    

