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
    var width = 38;
    var height = 38;
    var holes = 20;
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
          //demarcate minutes
          seconds < 59 ? ( seconds++ ) : ( seconds = 0, minutes++ );
        }

        function retainZero() {
          //retain 0 at beginning of single digit numbers
          minutes < 10 ? ( minutesSubTen() ) : ( minutesOverTen() );
        }

          function minutesSubTen() {
            seconds < 10 ? $clock.html( '0' + minutes + ':0' + seconds ) : $clock.html( '0' + minutes + ':' + seconds )
          }

          function minutesOverTen() {
            seconds < 10 ? $clock.html( minutes + ':0' + seconds ) : $clock.html( minutes + ':' + seconds )
          }

    function stopTimer() {
      clearInterval( clock );
    }

  //Board setup

    function newGame() {
      cleanBoard();
      resetForm();
    }

      function resetForm() {
        $gameboard.append(
          '<form id="setupForm">' +
            'Width: <input type="text" name="width" value="' + width + '"><br>' +
            'Height: <input type="text" name="height" value="' + height + '"><br>' +
            'Hole count: <input type="text" name="holes" value="' + holes + '"><br>' +
          '</form>' +
          '<button onclick="setup()">Start digging!</button>'
        );
        $setupForm = $gameboard.find('#setupForm');
      }

      function cleanBoard() {
        $gameboard.html('');
        $clock.html('00:00');
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
        assignCoreVars(formInput);
        if ( holeRatio() < 0.2 ){
          makeBoard();
          timer();
          play();
        } else {
          alert("Woah! You'll fall in!");
          cleanBoard();
          resetForm();
        }
      }

        function assignCoreVars (input) {
          var formOutput = input.split(" ");  
          width = parseInt(formOutput[0]);
          height = parseInt(formOutput[1]);
          holes = parseInt(formOutput[2]);
        }

        function holeRatio() {
          return holes / (width * height);
        }

      function makeBoard() {
        cleanBoard();
        for (var i = 1; i < parseInt(height) + 1; i++) {
          $gameboard.append('<div id="row' + i + '" class="row" ></div>')
          for (var x = 1; x < parseInt(width) + 1; x++) {
            $('#row'+i).append('<span id="' + i + '-' + x + '" class="space" ><img src="images/space.jpg"></span>');
            $gameboard.css({"width": width * 19 + "px"});
          }
        }
        $spaces = $gameboard.find('.space');
        holeSetup();
      }

        function holeSetup() {
          for (var i = 0; i < holes; i++) {
            var col = randomSpace(height) + 1;
            var row = randomSpace(width) + 1;
            holeCoordinates.push([col, row]);
            for (var j = 0; j < holeCoordinates.length-1; j++) {
              if ( holeCoordinates[j][0] == col && holeCoordinates[j][1] == row ) {
                holeCoordinates.pop();
                i--;
              }
            }
          }
        }

          function randomSpace(axis) {
            return Math.floor(Math.random() * axis);
          }

  //Game play
    
    function play() {
      $spaces.click( function() {
        dig( $(this) );
      });
    }

      function dig(space) {
        var clickedCol = space.attr('id').split('-')[0];
        var clickedRow = space.attr('id').split('-')[1];
        for (var i = 0; i < holeCoordinates.length; i++ ) {
          if ( holeCoordinates[i][0] == clickedRow && holeCoordinates[i][1] == clickedCol ) {
            space.find('img').attr('src', "images/hole.jpg");
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
      // newGame();
      showHoles();
    });

//execute

  $(function(){
    newGame();

  });