'use strict';

//Authenticated page client handler

// Create a function that is enclosed and can trigger ajax function and on Ready fucnction

(function () {
   //Create variables for DOM items
   var allPolls = document.querySelector('#All_Polls');
   var all_polls = document.querySelector('#all-polls');
   var view_polls = document.querySelector('#View_polls');
   var user_polls = document.querySelector('#User_polls');
   var submit_button = document.querySelector('#submitButton');
   var user = document.querySelector('#username');
   var apiUrl = 'https://voting-poll-mesarikaya.c9users.io/loggedin';
   
   //Run the function sent via AJAX
   function ready (fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         console.log("inside the ready function");
         
         return fn();
      }
       all_polls.hide();
      document.addEventListener('DOMContentLoaded', fn, false);
   }

   //Create ajax request
   function ajaxRequest (method, url, callback) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
      xmlhttp.send();
   }
   
   //Create the poll list
   function createPollList (data) {
         //alert("In general view");
         var PollListObject = JSON.parse(data);
         var pollListHtml = "";
         var len = PollListObject.length;
         //console.log("data is: ", PollListObject);
         
         //Create the Poll Lists for the DOM item
         for (var i = 0; i < PollListObject.length; i++) {
            var name = PollListObject[i].poll_data.Poll_name;
            var id = PollListObject[i]._id;
            if ( (typeof name !== "undefined") && (name!== null) && name !== "" 
                 && (JSON.stringify(name) !== " ") && (JSON.stringify(name) !== ""))
            {
               pollListHtml +=  '<div class="well well-sm" >'+ '<a href="/poll/' + id + '"' +
                                   'method="get"' + 'id="' + id +'"' + 'name="' + name + '" >' +
                                   name + '</a></div>';
            }
                   
         }
         //Update the inner HTML of the DOM item
         allPolls.innerHTML = pollListHtml;
         //Print Users name if available
         user.innerHTML = PollListObject[len-1].google.name;
   }
   
   
   // When ready, refresh the open url'
   var lastFive = window.location.href.substr(window.location.href.length - 5);
   if (lastFive === '/true' || lastFive === '/false' || lastFive === 'gedin'){
      ready(ajaxRequest('GET', window.location.href , createPollList));
   }
   else{
      ready(ajaxRequest('GET', apiUrl + '/true' , createPollList));
   }
   
   
   // On click, submit the new Poll to the database and update the page
   submit_button.addEventListener('click', function () {
         ajaxRequest('GET', apiUrl, createPollList);
         
   }, false);
   
   // On click show the list of all polls
   view_polls.addEventListener('click', function () {
         ajaxRequest('GET', apiUrl + '/true', createPollList);
         all_polls.toggle( 50, function() {
            // Animation complete.
          });
   }, false);
   
   // On click show the list of User's polls
   user_polls.addEventListener('click', function () {
         ajaxRequest('GET', apiUrl + '/false', createPollList);
         all_polls.toggle( 50, function() {
            // Animation complete.
          });
   }, false);
   

})();