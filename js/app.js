$('document').ready(function(){
var zombies = $('.zombie');
var board = $('.board');
var scoreBoard = $('.score');
var tryAgainImg = $('#tryAgain');
var score = 0;
var time = 10;
var zsShown = 0;
var level = 1;
var difficulty;
var interval;
var popUpInterval;
var hiddenInterval;
var zombieUp;
var hitZombie;

//things still in development
localStorage.highScore = [ ];
var kapowImg = '<img id="kapow" src="./decor/Kapow.png">';

//--Sound file stuff--
//intro music
var introMusic = document.createElement('audio');
introMusic.src = './decor/danger_zone.mp3';
introMusic.volume = 1;
introMusic.autoPlay = true;
introMusic.preLoad = true;
//impact
var impactSound = document.createElement("audio");
impactSound.src = "./decor/impact.mp3";
impactSound.volume = 0.6;
impactSound.autoPlay = false;
impactSound.preLoad = true;
//Game music
var gameMusic = document.createElement('audio');
gameMusic.src = './decor/sugarPlumFairy.mp3';
gameMusic.volume = 0.5;
gameMusic.autoPlay = false;
gameMusic.preLoad = true;
//Plugin to allow for CSS alteration where it normally wouldn't
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
  introMusic.play();
// generate a random number to determine which zombie should pop up
  function randomZombie(min, max){
    min = Math.ceil(0);
    max = Math.floor(8);
    return Math.floor(Math.random()*(max-min+1))+min;
  }
// Allll the things that happen when you click "Let's go!"
  $('#start').on('click', function(){
    event.preventDefault();
    introMusic.pause();
    gameMusic.play();
    difficulty = $('input[name=difficulty]:checked').val();
    hideIntro();
    board.show();
    scoreBoard.show();
    showScore();
    $('#reset').show();
    $('#countDownTimer').show();
    interval = setInterval(timer, 1000);
    checkLevel();
    popUp();
  });
//Things that need to be hidden after you click "Let's go!"
  function hideIntro(){
    tryAgainImg.hide();
    $('#intro').hide();
    $('.introZombie').hide();
    $('#start').hide();
    $('form').hide();
  }
//Simple function to show the current score on the board
  function showScore(){
    $('#score').html("Score:" + score);
  }
//Creates and manages game timer
  function timer(){
    time -= 1;
    $("#timer").html(time);
    if (time <= 0){
      clearInterval(interval);
      gameEnd();
    }
  };
//Check for level advancement and shorten popup length
  function checkLevel(){
    switch (level) {
      case 2:
        difficulty -= 20;
        break;
      case 3:
        difficulty -= 20;
        break;
      case 4:
        difficulty -= 20;
        break;
      case 5:
        difficulty -= 20;
        break;
    }
  }
//Controls how often zombies pop up
  function popUp(){
    if (time >0){
      showZombie();
      popUpInterval = setTimeout(popUp, 1500);
    }
  }
//What actually shows/hides the zombies and accepts the difficulty level
  function showZombie(){
    zsShown ++;
    zombieUp=randomZombie();
    zombies[zombieUp].style.visibility='visible';
    setTimeout(function hideZombie(){
      hiddenInterval = zombies[zombieUp].style.visibility='hidden';
    }, difficulty);
    clickZombie();
  }
//Hides zombie when clicked and adds to the score
  function clickZombie(){
    zombies.on('click', function(){
      impactSound.play();
      hitZombie = this;
      $(this).replaceWith(kapowImg); 
      showHit();
      score= score+1;
      showScore()
      $(this).invisible();
      zombies.off('click');
    })
  }
//Show kapow
  function showHit(){
    setTimeout(function revertImage(){
        revertInterval = $("#kapow").replaceWith(hitZombie);
      }, 100); 
  }
//Hides a bunch of stuff and shows the end game score board message
  function gameEnd(){
    if (time == 0){
      board.hide();
      scoreBoard.hide();
      $('#countDownTimer').hide();
      gameMusic.pause();
      introMusic.play();
      // var newScore = JSON.stringify(score);
      // localStorage.highScore.push(newScore);
      // localStorage.highScore.sort(function(a,b){return b-a});
      //console.log(localStorage.highScore);
      endScoreMessage();
      $('.modal').show();
    }
  }
//Determines what the end game score board message will say and advance to next level
  function endScoreMessage(){
    switch(true){
      case (score == 0):
        $('#modalContent').html("Level: " + level + " " + "Score: " + score + "/" + zsShown + '<br>' + "Have fun being a zombie. You're doomed.");
        break;
      case (score < 5):
        $('#modalContent').html("Level: " + level + " " + "Score: " + score + "/" + zsShown + '<br>' + "Oh dear. Hope you're a better runner.");
        break;
      case (score < 10):
        $('#modalContent').html("Level: " + level + " " + "Score: " + score + "/" + zsShown + '<br>' + "Oh no! Those zombies really got the best of you!");
        break;
      case (score < 20):
        $('#modalContent').html("Level: " + level + " " + "Score: " + score + "/" + zsShown + '<br>' + "Oh my. Some of them definitely escaped.");
        break;
      case (score < 30):
        $('#modalContent').html("Level: " + level + " " + "Score: " + score + "/" + zsShown + '<br>' + "You're pretty good at smashing zombies!");
        break;
      case (score < 50):
        $('#modalContent').html("Level: " + level + " " + "Score: " + score + "/" + zsShown + '<br>' + "Thanks to you the world is a safer place!");
        break;
      case (score > 50):
        $('#modalContent').html("Level: " + level + " " + "Score: " + score + "/" + zsShown + '<br>' + "How did you do that?! You're the best around!");
        break;
    }
    level++;
  }
//All the things that need to get reset when you click "Try again!"
  $('#reset').on('click', function(){
    time = 60;
    score = 0;
    zsShown = 0;
    gameMusic.pause();
    introMusic.play();
    scoreBoard.hide();
    tryAgainImg.show();
    board.hide();
    clearInterval(interval);
    timer();
    clearTimeout(popUpInterval);
    clearTimeout(hiddenInterval);
    $('#countDownTimer').hide();
    $('#start').show();
    $('#reset').hide();
    $('.modal').hide(); 
    $('form').show();
  })

});

//save scores to server
//Multi level game?
//add a hit image