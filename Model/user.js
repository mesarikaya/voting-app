'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	google: {
      oauthID: Number,
      name: String,
      created: Date
	},
    poll_data: { 
      Poll_name: String,
      Questions : Array,
      Votes : Array
   }
});

module.exports = mongoose.model('User', User);
