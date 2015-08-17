//DOM

  $container = $('#container');
  $counter = $container.find('#counter');
  $clock = $container.find('#clock');
  $smiley = $container.find('#smiley');
  $gameboard = $container.find('#gameboard');
  $setupForm = $container.find('#setupForm');

//House variables
  //clock sections
    var seconds = 0;
    var minutes = 0; 

  //board setup
    var width = 20;
    var height = 20;
    var holes = 10;

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
      $gameboard.append('<form id="setupForm" action="form_action.asp">' + 
          'Width: <input type="text" name="width" value="38"><br>' +
          'Height: <input type="text" name="height" value="38"><br>' +
          'Hole count: <input type="text" name="holes" value="20"><br>' +
        '</form>' + 
        '<button onclick="setup()">Start digging!</button>')
    }

    function setup() {
      var formInput = [];
      for (var i = 0; i < $setupForm[0].length; i++) {
        formInput += $setupForm[0].elements[i].value + " ";
      }
      formProcess(formInput);
      makeBoard();
      timer();
    }

      function formProcess(formInput) {
        formOutput = formInput.split(" ");
        width = formOutput[0];
        height = formOutput[1];
        holes = formOutput[2];
      }

      function cleanBoard() {
        $gameboard.html('');
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
      }

$(function(){
  $smiley.click(function() {
    stopTimer();
    newGame();
  });
});