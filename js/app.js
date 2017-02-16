$('document').ready(function(){
var zombies = $('.zombie');
var board = $('.board');
var scoreBoard = $('.score');
var tryAgainImg = $('#tryAgain');
var score = 0;
var time = 10;
var difficultyLevel;
var interval;
var popUpInterval;
var hiddenInterval;
var zombieUp;

var impactSound = document.createElement("audio");
impactSound.src ="./decor/impact.mp3";
impactSound.volume = 0.4;
impactSound.autoPlay = false;
impactSound.preLoad = true;

var zsShown = 0;

jQuery.fn.visible = function() {
    return this.css('visibility', 'visible');
};

jQuery.fn.invisible = function() {
    return this.css('visibility', 'hidden');
};
// prepare game screen by hiding unnecessary things
  $('#countDownTimer').hide();
  board.hide();
  scoreBoard.hide();
  tryAgainImg.hide();
// generate a random number to determine which zombie should pop up
  function randomZombie(min, max){
    min = Math.ceil(0);
    max = Math.floor(8);
    return Math.floor(Math.random()*(max-min+1))+min;
  }
// Allll the things that happen when you click "Let's go!"
  $('#start').on('click', function(){
    event.preventDefault();
    difficultyLevel = $('input[name=difficulty]:checked').val();
    tryAgainImg.hide();
    hideIntro();
    board.show();
    scoreBoard.show();
    $('#reset').show();
    $('#countDownTimer').show();
    interval = setInterval(timer, 1000);
    popUp();
    clickZombie();
  });
//Things that need to be hidden after you click "Let's go!"
  function hideIntro(){
    $('#intro').hide();
    $('.introZombie').hide();
    $('#start').hide();
    $('form').hide();
  }
//Simple function to show the current score on the board
  function showScore(){
    $('#score').html("Score:" + score);
  }
//Creates game timer
  function timer(){
    time -= 1;
    $("#timer").html(time);
    if (time <= 0){
      clearInterval(interval);
      gameEnd();
    }
  };
//Controls length of time Zombies pop up for
  function popUp(){
    if (time >0){
      showZombie();
      popUpInterval = setTimeout(popUp,1500);
    }
  }
//What actually zshows/hides the zombies and accepts the level difficulty
  function showZombie(){
    zsShown ++;
    console.log("#ofZsShown:" + zsShown);
    zombieUp=randomZombie();
    zombies[zombieUp].style.visibility='visible';
    setTimeout(function hideZombie(){
      hiddenInterval = zombies[zombieUp].style.visibility='hidden';
    },difficultyLevel);
  }
//Hides zombie when clicked and adds to the score
  function clickZombie(){
    zombies.on('click', function(){
      impactSound.play();
      score= score+1;
      showScore()
      console.log("score:" + score);
      $(this).invisible();
    })
  }
//Hides a bunch of stuff and shows the end game score board message
  function gameEnd(){
    if (time == 0){
      console.log('Game over');
      board.hide();
      scoreBoard.hide();
      $('#countDownTimer').hide();
      endScoreMessage();
      $('.modal').show();
    }
  }
//Determines what the end game score board message will be
  function endScoreMessage(){
    console.log(score);
    switch(true){
      case (score == 0):
        $('#modalContent').html("Score: " + score + "/" + zsShown + '<br>' + "Have fun being a zombie. You're doomed.");
        break;
      case (score < 5):
        $('#modalContent').html("Score: " + score + "/" + zsShown + '<br>' + "Oh dear. Hope you're a better runner.");
        break;
      case (score < 10):
        $('#modalContent').html("Score: " + score + "/" + zsShown + '<br>' + "Oh no! Those zombies really got the best of you!");
        break;
      case (score < 20):
        $('#modalContent').html("Score: " + score + "/" + zsShown + '<br>' + "Oh my. Some of them definitely escaped.");
        break;
      case (score < 30):
        $('#modalContent').html("Score: " + score + "/" + zsShown + '<br>' + "You're pretty good at smashing zombies!");
        break;
      case (score < 50):
        $('#modalContent').html("Score: " + score + "/" + zsShown + '<br>' + "Thanks to you the world is a safer place!");
        break;
      case (score > 50):
        $('#modalContent').html("Score: " + score + "/" + zsShown + '<br>' + "You're the best around!");
        break;
    }
  }
//All the things that need to get reset when you click "Try again!"
  $('#reset').on('click', function(){
    time = 60;
    score = 0;
    scoreBoard.hide();
    tryAgainImg.show();
    board.hide();
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
//have style options
//add a hit image + sound