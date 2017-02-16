console.log('Ello');

$('document').ready(function(){
var zombies= $('.zombie');
var board= $('.board');
var scoreBoard = $('.score');
var modalContent = $('#modalContent');
var score = 0;
var time = 60;
var difficultyLevel;
var interval;
var popUpInterval;
var hiddenInterval;
var zombieUp;

var zsShown = 0;

jQuery.fn.visible = function() {
    return this.css('visibility', 'visible');
};

jQuery.fn.invisible = function() {
    return this.css('visibility', 'hidden');
};

  $('#countDownTimer').hide();
  board.hide();
  scoreBoard.hide();

  function randomZombie(min, max){
    min = Math.ceil(0);
    max = Math.floor(8);
    return Math.floor(Math.random()*(max-min+1))+min;
  }

  $('#start').on('click', function(){
    event.preventDefault();
    difficultyLevel = $('input[name=difficulty]:checked').val();
    console.log(difficultyLevel);
    hideIntro();
    $('form').hide();
    board.show();
    scoreBoard.show();
    $('#reset').show();
    $('#countDownTimer').show();
    interval = setInterval(timer, 1000);
    popUp();
    clickZombie();
  });

  function hideIntro(){
    $('#intro').hide();
    $('.introZombie').hide();
    $('#start').hide();
  }

  function showScore(){
    $('#score').html("Score:" + score);
  }

  function timer(){
    time -= 1;
    $("#timer").html(time);
    if (time <= 0){
      clearInterval(interval);
      gameEnd();
    }
  };

  function popUp(){
    if (time >0){
      showZombie();
      popUpInterval = setTimeout(popUp,1500);
    }
  }

  function showZombie(){
    zsShown ++;
    console.log("#ofZsShown:" + zsShown);
    zombieUp=randomZombie();
    zombies[zombieUp].style.visibility='visible';
    setTimeout(function hideZombie(){
      hiddenInterval = zombies[zombieUp].style.visibility='hidden';
    },difficultyLevel);
  }


  function clickZombie(){
    zombies.on('click', function(){
      score= score+1;
      showScore()
      console.log("score:" + score);
      $(this).invisible();
    })
  }

  function gameEnd(){
    if (time == 0){
      console.log('Game over');
      board.hide();
      switch (score){
        case (score < 5):
          $('#modalContent').html("Score: " + score + "\nOh dear. Hope you're a better runner.");
          break;
        case (score< 10):
          modalContent.html("Score: " + score + "\nOh no! Those zombies really got the best of you!");
          break;
        case (score< 20):
          modalContent.html("Score: " + score + "\nOh my. Some of them definitely escaped.");
          break;
        case (score < 30):
          modalContent.html("Score: " + score + "\nYou're pretty good at smashing zombies!");
          break;
        case (score < 50):
          modalContent.html("Score: " + score + "\nThanks to you the world is a safer place!");
          break;
        case (score > 50):
          modalContent.html("Score: " + score + "\nYou're the best around!");
          console.log("I thought about it and naw");
      }
      $('.modal').show();
    }
  }


  $('#reset').on('click', function(){
    time = 60;
    score = 0;
    showScore();
    zsShown = 0;
    clearInterval(interval);
    timer();
    zombies.off('click');
    clearTimeout(popUpInterval);
    clearTimeout(hiddenInterval);
    $('#countDownTimer').hide();
    $('#start').show();
    $('#reset').hide();
    $('.modal').hide(); 
    $('form').show();
  })




});

//create score board, save scores to server?
//have levels of difficultie 
//have style options
//add a hit image + sound