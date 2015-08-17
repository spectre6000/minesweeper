//DOM

  $container = $('#container');
  $counter = $container.find('#counter');
  $clock = $container.find('#clock');
  $smiley = $container.find('#smiley');
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

    function setup() {
      var formInput = [];
      for (var i = 0; i < $setupForm[0].length ;i++) {
        formInput += $setupForm[0].elements[i].value + " ";
      }
      formProcess(formInput);
    }

      function formProcess(formInput) {
        formOutput = formInput.split(" ");
        width = formOutput[0];
        height = formOutput[1];
        holes = formOutput[2];
      }

      function makeBoard

$(function(){
    timer();
  $smiley.click(function() {
    stopTimer();
    console.log("width: " + width + ", height: " + height + ", holes: " + holes);
  });
});