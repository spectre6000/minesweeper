//DOM

  var $container = $('#container');
  var $counter = $container.find('#counter');
  var $clock = $container.find('#clock');
  var $smiley = $container.find('#smiley');
  var $gameboard = $container.find('#gameboard');
  var $setupForm = $container.find('#setupForm');
  var $spaces = $gameboard.find('.space');

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
        $setupForm = $container.find('#setupForm');
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
        } else {
          alert("Woah! You'll fall in!");
          cleanBoard();
          resetForm();
        }
      }

        function assignCoreVars (input) {
          var formOutput = input.split(" ");  
          width = formOutput[0];
          height = formOutput[1];
          holes = formOutput[2];
        }

        function holeRatio() {
          return holes / (width * height);
        }

      function makeBoard() {
        cleanBoard();
        for (var i = 0; i < height; i++) {
          var h = i + 1;
          $gameboard.append('<div id="row' + h + '" class="row" ></div>')

          for (var x = 0; x < width; x++) {
            var w = x + 1;
            $('#row'+i).append('<span id="row' + h + 'col' + w + '" class="space" ><img src="images/space.jpg"></span>');
            $gameboard.css({"width": width * 19 + "px"});
          }
        }
        holeSetup();
      }

        function holeSetup() {
          for (var i = 0; i < holes; i++) {
            var col = randomSpace(width);
            var row = randomSpace(height);
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



//execute

  $(function(){
    $smiley.click(function() {
      stopTimer();
      newGame();
    });
  });