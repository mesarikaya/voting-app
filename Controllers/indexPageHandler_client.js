'use strict';
// Create a function that is enclosed and can trigger ajax function and on Ready fucnction
(function () {
   var addButton = document.querySelector('#Add_New_Poll');
   var allPolls = document.querySelector('#All_Polls');
   var panel_row = document.querySelector('#all_polls');
   var modalButton = document.querySelector('#myBtn');
   var myModal = document.querySelector('#myModal');
   var all_polls = document.querySelector('#all-polls');
   var view_polls = document.querySelector('#View_polls');
   var submit_button = document.querySelector('#submitButton');
   var New_Entry_Form = document.querySelector('#NewEntryForm');
   var apiUrl = 'https://voting-app-website.herokuapp.com/home';
   
   //Run the function sent via AJAX
   function ready (fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         console.log("inside the ready function");
         return fn();
      }

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
      var PollListObject = JSON.parse(data);
      var pollListHtml = "";
      console.log("data is: ", PollListObject);
      for (var i = 0; i < PollListObject.length; i++) {
         var name = PollListObject[i].poll_data.Poll_name;
         var id = PollListObject[i]._id;
         if ( (typeof name !== "undefined") && (name!== null) && name !== "" 
              && (JSON.stringify(name) !== " ") && (JSON.stringify(name) !== ""))
         {
            //alert(JSON.stringify(name));
            pollListHtml +=  '<div class="well well-sm" >'+ '<a href="/poll/' + id + '"' +
                                'method="get"' + 'id="' + id +'"' + 'name="' + name + '" >' +
                                name + '</a></div>';
         }
                
      }
      allPolls.innerHTML = pollListHtml;
   }
   
   ready(ajaxRequest('GET', apiUrl, createPollList));
   
   submit_button.addEventListener('click', function () {
         ajaxRequest('GET', apiUrl , createPollList);
   }, false);
   
})();
