'use strict';

module.exports = {
  'googleAuth': {
	'clientID': process.env.GOOGLE_CLIENTID,
	'clientSecret': process.env.GOOGLE_SECRET,
	'callbackURL': process.env.APP_URL + 'auth/google/callback'
  }
};