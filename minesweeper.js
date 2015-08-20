//DOM

  var $container = $('#container');
  var $counter = $container.find('#counter');
  var $clock = $container.find('#clock');
  var $smiley = $container.find('#smiley');
  var $gameboard = $container.find('#gameboard');
  var $setupForm;
  var $spaces = $gameboard;

//House variables
  //clock sections
    var seconds = 0;
    var minutes = 0; 

  //board setup
    var columns = 5;
    var rows = 5;
    var holes = 4;
    var holeCoordinates = [];

//Movement

  //Timer
    function timer(){
      //start clock
      clock = setInterval(function(){clockworks()}, 1000);
    }

      function clockworks(){ 
        demarcateMinutes();
        retainZero();
      }

        function demarcateMinutes() {
          //advance seconds, then advance minutes and reset seconds
          seconds < 59 ? ( seconds++ ) : ( seconds = 0, minutes++ );
        }

        function retainZero() {
          //distribution for retaining 0 in single digits
          minutes < 10 ? ( minutesSubTen() ) : ( minutesOverTen() );
        }

          function minutesSubTen() {
            //control clock display for single digit minutes
            seconds < 10 ? $clock.html( '0' + minutes + ':0' + seconds ) : $clock.html( '0' + minutes + ':' + seconds )
          }

          function minutesOverTen() {
            //control clock display for double digit minutes
            seconds < 10 ? $clock.html( minutes + ':0' + seconds ) : $clock.html( minutes + ':' + seconds )
          }

    function stopTimer() {
      //reset timer
      clearInterval( clock );
      seconds = 0;
      minutes = 0;
    }

  //Board setup

    function newGame() {
      cleanBoard();
      resetForm();
    }

      function resetForm() {
        //replace board or overpopulated form with fresh form
        $gameboard.append(
          '<form id="setupForm">' +
            'Columns: <input type="text" name="columns" value="' + columns + '"><br>' +
            'Rows: <input type="text" name="rows" value="' + rows + '"><br>' +
            'Hole count: <input type="text" name="holes" value="' + holes + '"><br>' +
          '</form>' +
          '<button onclick="setup()">Start digging!</button>'
        );
        //give form width for centering
        $gameboard.css({"width": "15%"});
        //redefine new form element
        $setupForm = $gameboard.find('#setupForm');
      }

      function cleanBoard() {
        //wipe everything and start over
        $gameboard.html('');
        $clock.html('00:00');
        $smiley.attr('src', 'images/smile.gif');
      }

    function setup() {
      //split out the form values to parse into global variables
      var formInput = [];
      for (var i = 0; i < $setupForm[0].length; i++) {
        formInput += $setupForm[0].elements[i].value + " ";
      }
      formProcess(formInput)
    }

      function formProcess(formInput) {
        //set house variables
        assignCoreVars(formInput);
        //make sure hole population isn't too high
        if ( holeRatio() < 0.2 ){
          //start a game
          makeBoard();
          timer();
          play();
        } else {
          //new form to try again
          alert("Woah! You'll fall in!");
          cleanBoard();
          resetForm();
        }
      }

        function assignCoreVars (input) {
          //split out form input and assign to house vars
          var formOutput = input.split(" ");  
          columns = parseInt(formOutput[0]);
          rows = parseInt(formOutput[1]);
          holes = parseInt(formOutput[2]);
          //new set of holes
          holeCoordinates = [];
        }

        function holeRatio() {
          //percentage of board that are holes
          return holes / (columns * rows);
        }

      function makeBoard() {
        cleanBoard();
        for (var i = 1; i < parseInt(rows) + 1; i++) {
          //add class for rows (will likely prove unnecessary)
          $gameboard.append('<div id="row' + i + '" class="row" ></div>')
          for (var x = 1; x < parseInt(columns) + 1; x++) {
            //add class for cells by coordinates for targeting
            $('#row'+i).append('<span id="' + i + '-' + x + '" class="space" ><img src="images/space.jpg"></span>');
            //give gameboard a defined width for CSS purposes
            $gameboard.css({"width": columns * 19 + "px"});
          }
        }
        //redefine $spaces since they weren't available for initial definitions
        $spaces = $gameboard.find('.space');
        holeSetup();
      }

        //as this is it DOES create the correct number of spaces, within the proper min/max
        function holeSetup() {
          //make the number of holes indicated in the setup form
          for (var i = 0; i < holes; i++) {
            //generate two random NUMBERS for the coordinates
            var col = randomSpace(rows) + 1;
            var row = randomSpace(columns) + 1;
            //push the coordinates to the holeCoordinates global array
            holeCoordinates.push([col, row]);
            //make sure they're not already in the array
            if (multidimensionalArrayContains(holeCoordinates, holeCoordinates.length-1, col, row)) {
              //if they ARE in the arrap, pop them off the end...
              holeCoordinates.pop();
              //...and back up a step to maintain the correct number of holes
              i--;
            } 
          }
        }

          function randomSpace(axis) {
            //simple random number generator... this seems common enough an action that it might be a method on its own.
            return Math.floor(Math.random() * axis);
          }

    //indexOf for multidimensional arrays; length required for holeSetup loop to prevent infinite loop
    function multidimensionalArrayContains(array, length, pos0, pos1) {
      //go through a given array (holeCoordinates)
      for (var i = 0; i < length; i++) {
        //check both elements of sub-array
        if ( array[i][0] === pos0 && array[i][1] === pos1 ) {
          return true;
        }
      }
    }

  //Game play
    
    function play() {
      $spaces.click( function() {
        dig( $(this) );
      });
    }

      function dig(space) {
        //split out coordinates
        var col = parseInt(space.attr('id').split('-')[0]);
        var row = parseInt(space.attr('id').split('-')[1]);
        //check for hole
        if (multidimensionalArrayContains(holeCoordinates, holeCoordinates.length, col, row)) {
          showHoles();
          $smiley.attr('src', 'images/digging.gif');
        } else {
          //find adjactent mines
          pokeSand(col, row);
        }
      }

        function pokeSand(col, row) {
          //convert coordinates to ints for calcs
          var y = col;
          var x = row;
          //define adjacent cells
          var adjacentCells = [];
          var adjacentCellOptions = [[y+1, x-1], [y+1, x], [y+1, x+1], [y, x-1], [y, x+1], [y-1, x-1], [y-1, x], [y-1, x+1]];
          //populate adjacentCells array with viable cell options 
          for (var i = 0; i < adjacentCellOptions.length; i++) {
            if (adjacentCellOptions[i][0] > 0 && adjacentCellOptions[i][0] <= columns && 
            adjacentCellOptions[i][1] > 0 && adjacentCellOptions[i][1] <= rows) {
              adjacentCells.push(adjacentCellOptions[i]);
            }
          }
          //counter for clicked space
          var counter = 0;
          // cycle through adjacent cells and add 1 to counter for each adjacent hole
          for (var i = 0; i < adjacentCells.length; i++) {
            //check for match
            if (multidimensionalArrayContains(holeCoordinates, holeCoordinates.length, adjacentCells[i][0], adjacentCells[i][1])) {
              //advance counter indicating nuber of adjacent holes
              counter++;
            }
          }
          //if there are any adjacent holes
          //counter > 0 + border limits are the recursive base case
          if (counter > 0) {
            //indicate with numbered png
            $('#'+col+'-'+row+' img').attr('src', 'images/numbers/' + counter + '.png');
          } else {
            //if there aren't any adjacent holes
            for (var i = 0; i < adjacentCells.length; i++) {  
              //run through adjacent cells recursively
              pokeSand(i[0], i[1]);
            }
          }
        }

      function showHoles() {
        for (var i = 0; i < holeCoordinates.length; i++ ) {
          $('#' + holeCoordinates[i][0] + '-' + holeCoordinates[i][1]).find('img').attr('src', "images/hole.jpg");
        }
      }

    $smiley.click(function() {
      stopTimer();
      newGame();
    });

//execute

  $(function(){
    newGame();
  });