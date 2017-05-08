'use strict';

var FormHandler = require(process.cwd() + '/Controllers/formHandler_server.js');


module.exports = function(app, passport) {
    var formHandler = new FormHandler();
        
    function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()){
        return next();
      }
      else{
          //Do nothing, stay in the current page
          res.redirect('/');
      }
    }

    app.route('/home')
            .get(function(req,res){
                formHandler.displayPolls(req, res, 'true');
            });
    
    
    // Check login at home page on open
    app.route('/')
            .get(function(req,res){
                res.sendFile(process.cwd() + '/Public/views/index.html');
            });
    
    // Check home page on open
    app.route('/auth/google')
            .get(passport.authenticate('google',
                {scope: [
                'https://www.googleapis.com/auth/plus.login',
                'https://www.googleapis.com/auth/plus.profile.emails.read'
                ]}
            ));
    
    // Googlecallback call
    app.get('/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/' }),
      function(req, res) {
        res.redirect('/login');
    });
    
    //Check if authentication exits and open the logged in page
    app.route('/login')
            .get(ensureAuthenticated,function (req, res) {
                res.sendFile(process.cwd() + '/Public/views/login.html');
            });
    
    //On button clicks display the list
    app.route('/loggedin/:viewType')
            .get(ensureAuthenticated, function (req, res){
                formHandler.displayPolls(req,res, req.params.viewType.toString());
            })            
            .post(ensureAuthenticated,function (req, res) {
                res.sendFile(process.cwd() + '/Public/views/login.html');
            });
    
    // Default page after authentication
    app.route('/loggedin')
            .get(ensureAuthenticated, function (req, res){
                var search = 'true';
                formHandler.displayPolls(req,res, search);
            })
            .post(ensureAuthenticated,function (req, res) {
                formHandler.insertDetails(req,res);
                res.redirect('/login');
            });
     
     //After logout go back to opening page
    app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});
    
    // Open the selected poll and display its results
    app.route('/poll/:pollid')
            .post(function(req,res){
                formHandler.updatePoll(req,res);
                res.sendFile(process.cwd() + '/Public/views/poll.ejs');
            })
            .get(function(req, res){
                formHandler.createPollResult(req,res);
            });
    
    //Delete the poll   
    app.route('/poll/delete/:pollid')
            .get(ensureAuthenticated,function(req, res){
                formHandler.deletePoll(req,res);
                res.redirect('/login');
            });

};