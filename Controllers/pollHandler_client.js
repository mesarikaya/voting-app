'use strict';
// Client side control for Poll page
(function () {
   var apiUrl = window.location.href;
   var submitVoteButton = document.querySelector('#submitVoteButton');
   var voteForm = document.querySelector('#VoteForm');
   var deletePart = document.querySelector('#del');
   
   function ready (fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
   }

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
   
   
   // Create the poll name and options and set the google chart
   function createPollResultsView(data){
      // Set the chart data
      var questions = poll_data[0];
      var votes = poll_data[1];
      
      var results = [];
      for(var i=0; i <questions.length; i++){
          results.push([questions[i], votes[i]]);
      }

      //Create delete button
      if(poll_data[2].toString() === poll_data[3].toString()){
    	      var deleteButton = '<form role="form" action="/poll/delete/'+ poll_data[4] +'" id="DeletePollForm" method="get">' +
    	                           '<button type="submit" name="deleteButton" value="deleteButton" class="btn btn-warning" id="deletePollButton" style=" border-radius: 8px; font-size: 14px">' +
    	                           'Delete' + '<span class="glyphicon glyphicon-trash" style="font-size: 10px; margin: 2px"></span></button> </form>';
	      deletePart.innerHTML=deleteButton;
      }
      
      // Load the Visualization API and the corechart package.
      google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.

      function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
         
        // Retrieve the data and paste it to Google charts data
        data.addRows(results);

  
       //Set chart options
       var options = {    'legend':'bottom',
                          'backgroundColor':'AliceBlue',
                          'width':400,
                          'height':300,
                          'enableInteractivity':true,
                          'fontSize':12,
                          'pieHole': 0.4,
                          'forceIFrame': true,
                          'is3D': true
                     };
  
        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
          chart.draw(data, options);
      }
      
   }
   
   ready(ajaxRequest('GET', apiUrl, createPollResultsView));

   
})();
