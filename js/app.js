$('document').ready(function(){
var zombies = $('.zombie');
var board = $('.board');
var scoreBoard = $('.score');
var tryAgainImg = $('#tryAgain');
var kapowImg = '<img id="kapow" src="./decor/Kapow.png">';
var score = 0;
var time = 60;
var zsShown = 0;
var level = 1;
var difficulty;
var interval;
var popUpInterval;
var hiddenInterval;
var revertInterval;
var zombieUp;
var hitZombie;
var highScoreBoard = document.getElementById('highScoreBoard');
var highScores = [ ];
var retrievedScores;

//----------Sound file stuff----------
//intro music
var introMusic = document.createElement('audio');
introMusic.src = './decor/danger_zone.mp3';
introMusic.volume = 1;
introMusic.autoPlay = false;
introMusic.loop = true;
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
gameMusic.loop = true;
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
  $('#nextLevel').hide();
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
    clickZombie();
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
    difficulty -= (level * 20);
    }
//Controls how often zombies pop up
  function popUp(){
    if (time > 0){
      showZombie();
      popUpInterval = setTimeout(popUp, 1500);
    }
  }
//What actually shows/hides the zombies and accepts the difficulty level
  function showZombie(){
    zsShown ++;
    zombieUp = randomZombie();
    zombies[zombieUp].style.visibility='visible';
    setTimeout(function hideZombie(){
      hiddenInterval = zombies[zombieUp].style.visibility='hidden';
    }, difficulty);
  }
//Hides zombie when clicked and adds to the score
  function clickZombie(){
    board.delegate('.zombie', 'click', function(){
      impactSound.play();
      hitZombie = this;
      $(this).replaceWith(kapowImg); 
      showHit();
      score++;
      showScore()
      $(this).invisible();
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
      highScores.push(score);
      localStorage.setItem('highScoreBoard', JSON.stringify(highScores));
      retrievedScores = JSON.parse(localStorage.getItem('highScoreBoard'));
      populateScoreBoard();
      endScoreMessage();
      $('.modal').show();
      $('#nextLevel').show();
    }
  }
//Generate high score board content
  function populateScoreBoard(){
    retrievedScores.sort(function(a,b){return b-a});
    $('li').remove();
    for (var i = 0; i < retrievedScores.length; i++) {
      if (i < 3){
        highScoreBoard.innerHTML += "<li>" + retrievedScores[i];
      }
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
        $('#modalContent').html("Level: " + level + " " + "Score: " + score + "/" + zsShown + '<br>' + "Oh my. " + (zsShown - score) + " escaped.");
        break;
      case (score < 30):
        $('#modalContent').html("Level: " + level + " " + "Score: " + score + "/" + zsShown + '<br>' + "You're alright at smashing zombies.");
        break;
      case (score < 40):
        $('#modalContent').html("Level: " + level + " " + "Score: " + score + "/" + zsShown + '<br>' + "Thanks to you the world is a safer place!");
        break;
      case (score >= 40):
        $('#modalContent').html("Level: " + level + " " + "Score: " + score + "/" + zsShown + '<br>' + "How did you do that?! You're the best around!");
        break;
    }
  }
//All the things that need to get reset when you click "Try again!" or "Next level"
  function reset(){
    time = 60;
    score = 0;
    zsShown = 0;
    gameMusic.pause();
    introMusic.play();
    scoreBoard.hide();
    tryAgainImg.show();
    board.hide();
    clearInterval(interval);
    board.off('click');
    timer();
    clearTimeout(popUpInterval);
    clearTimeout(hiddenInterval);
    clearTimeout(revertInterval);
    $('#countDownTimer').hide();
    $('#start').show();
    $('#reset').hide();
    $('.modal').hide(); 
    $('form').show();
  }
//"Try again" button
  $('#reset').on('click', function(){
    reset();
    $('#nextLevel').hide();
  })
//"Next level" button
  $('#nextLevel').on('click', function(){
    reset();
    $('#nextLevel').hide();
    level++;
  })
});