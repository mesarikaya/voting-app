'use strict';

var Users = require('../Model/user.js');

function createPoll(db) {

     this.insertDetails = function (req, res) {
         // Insert the new poll if database is active
         var votes = [];
         var questions = req.body.options.split(";");

         for(var i=0; i < questions.length; i++){
            questions[i] = questions[i].replace('/[^\w\s!?]/g','');
            //votes[questions[i]].push(0.01);
            votes[i] = 0.01;
         }
         
         var poll_name = req.body.poll_name.replace(/[^\w\s]/g,'');
         
         Users
            .findOne({'google.oauthID': req.user.google.oauthID, 'poll_data.Poll_name':poll_name})
            .exec(function (err, result) {
                    if (err) { throw err; }
    
                    if (result) {
                        //If result exists, do nothing. User needs to delete
                        //console.log("Inside the found part. Poll is overwritten with: ", result);
                    } 
                    else {
                        //console.log("Inside insert.");
                        var newDoc = new Users({'google': 
                                                {
                                                  'oauthID': req.user.google.oauthID,
                                                  'name': req.user.google.name,
                                                  'created': Date.now()
                                            	},
                                                'poll_data':
                                                {'Poll_name':poll_name, 
                                                 "Questions" : questions, 
                                                 "Votes" : votes}
                                              });
                        newDoc.save(function (err, doc) {
                            if (err) { throw err; }
                            console.log("Insert is successful. Saved document: ", doc);
                        });
    
                    }
                });
    };
    
    this.displayPolls = function (req, res, viewAll) {
         // Set the search term and find the list to display as Poll List
         var search_term = {};
         //console.log("View all: " ,viewAll, viewAll === 'false',viewAll === 'true', typeof ViewAll );
         if (viewAll === 'false'){
            search_term = {"google.name":req.user.google.name};
         }
         else{
            search_term = {};
         }
         console.log("search term is: ", search_term);
         Users
            .find(search_term).sort({'google.created': -1}).exec(function (err, result) {
                        console.log("Inside exec");
                        if (err) { throw err; }
        
                        if (result) {
                            //console.log("Inside the found part. Poll is overwritten with: ");
                            return res.json(result);
                        } 
                        else {
                            return res.send({"Error": "No records could be found."});
                        }
                    });
    };
    
    this.createPollResult = function (req, res){
        //Create the Poll results or the clicked poll from poll list view
        
        Users
            .findOne({"_id":req.params.pollid})
            .exec(function (err, doc) {
                        if (err) { throw err; }
        
                        if (doc) {
                             console.log("Found documents: ", doc.google, req.user);
                             var c_user = "";
                             if (typeof req.user !== "undefined"){
                                 c_user = req.user.google.oauthID;
                             }
                             //console.log("Current user: ", c_user);
                             //Send out to the front-end and render the page
                             return res.render('poll.ejs',
                                  {
                    				data:{
                    				    Name: doc.poll_data.Poll_name,
                    					Questions: doc.poll_data.Questions,
                    					Votes: doc.poll_data.Votes,
                    					id: req.params.pollid,
                    					link: req.get('host')+req.originalUrl,
                    					creator: doc.google.oauthID,
                    					current_user: c_user
                    				}
                    			  });
                        }
                        else{
                            return res.json({"Error": "No records could be found."});
                        }
        });
    };
    
    this.updatePoll = function (req, res) {
        // Update the poll if database is active
        Users
            .findOne({"_id":req.params.pollid})
            .exec(function (err, doc) {
                        if (err) { throw err; }
        
                         if (doc){
                            var votes = doc.poll_data.Votes;
                            var selection = parseInt(req.body.optionDropdown,10);
                            votes[selection] += 1;
                            doc.poll_data.Votes = votes;
                            doc.markModified('poll_data.Votes');
                            
                            doc.save(function (err) {
                                if(err) {
                                    console.error('ERROR!');
                                }
                                console.log("Insert is successful. Saved document: ", doc);
                            });
                         }
                         else{
                             return res.send({"Error": "No records could be found."});
                         }
            });
  
    };
    
    // Delete the poll
    this.deletePoll = function (req, res) {
        Users
            .find({"_id":req.params.pollid}).remove().exec();
    };
    
    
}

module.exports = createPoll;
