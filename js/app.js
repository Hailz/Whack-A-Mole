console.log('Ello');

$('document').ready(function(){
var zombies= $('.zombie');
var board= $('.board');
var score = 0;
var time =60;
var interval;
var popUpInterval;
var hiddenInterval;
var zombieUp;

var zsShown =0;

jQuery.fn.visible = function() {
    return this.css('visibility', 'visible');
};

jQuery.fn.invisible = function() {
    return this.css('visibility', 'hidden');
};

  $('#countDownTimer').hide();
  board.hide();

  function randomZombie(min, max){
    min =Math.ceil(0);
    max = Math.floor(8);
    return Math.floor(Math.random()*(max-min+1))+min;
  }

  $('#start').on('click', function(){
    hideIntro();
    board.show();
    $('#reset').show();
    $('#countDownTimer').show();
    interval = setInterval(timer, 1000);
    popUp();
    clickZombie();
  });

  function hideIntro(){
    $('#intro').hide();
    $('#start').hide();
  }

  function showScore(){

  }

  function timer(){
    time -= 1;
    document.getElementById("timer").textContent=time;
    if (time<=0){
      clearInterval(interval);
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
    },1500);
  }


  function clickZombie(){
    zombies.on('click', function(){
      score= score+1;
      console.log("score:" + score);
      $(this).invisible();
    })
  }

  function gameEnd(){
    if (time == 0){

    }
  }

  $('#reset').on('click', function(){
    time =60;
    score =0;
    zsShown = 0;
    clearInterval(interval);
    timer();
    zombies.off('click');
    clearTimeout(popUpInterval);
    clearTimeout(hiddenInterval);
    $('#countDownTimer').hide();
    $('#start').show();
    $('#reset').hide(); 
  })


});


//create score board, save scores to server?
//reset button: reset timer, restart random interval pop up, reset score = 0