$(document).ready(function() {
    if (navigator.userAgent.search('Safari') >= 0 && navigator.userAgent.search('Chrome') < 0) {
        $('.game').height( $(window).height() * 0.9 );
    }


    var cards = ['item1', 'item2', 'item3', 'item4'];
    var pairs = cards.concat(cards);//create pairs of cards
    var chosenCards = [];
    var cardsToFlip = [];

    var gameStarted = false;
    var running = false;
    var outOfTime = false;
    var countdownStarted = false;
    var precountStarted = false;
    var win = false;
    var pairCount = 0;
    var time = 15;
    var pretime = 5;
    var init


    shuffleArray(pairs);//shuffle cards

    $('.back').each(function(i, element) {
        $(this).attr('id', pairs[i]);
    });


    function goBack (){
        $('.flip-container').each(function() {
            $(this).toggleClass('flip');
        });
        setTimeout(function(){
            $('.timer').text( time );
        },500)
        gameStarted = true;
        running = false;
    }

    function reSet (){
        gameStarted = false;
        running = false;
        outOfTime = false;
        countdownStarted = false;
        precountStarted = false;
        win = false;
        chosenCards = [];
        cardsToFlip = [];
        pairCount = 0;
        time = 15;
        pretime = 5;



        $('.timer').text( pretime );
        shuffleArray(pairs);
        $('.back').each(function(i, element) {
            $(this).attr('id', pairs[i]);
        });
        for(var i=0; i<9; i++){
            $('.flip-container').removeClass('flip');
        }

    }

    function precount () {
        precountStarted = true;
        var pretimeStart = +new Date;

        var pretimer = setInterval( function() {
            var pretimeNow = +new Date;
            var predifference = ( pretimeNow - pretimeStart ) / 1000;

            if (pretime > 0 ) {
                pretime = 5;
                pretime = Math.floor( pretime - predifference );
                $('.timer').text( pretime );
            } else {
                clearInterval(pretimer);
                goBack();
            }
        }, 250 );
    };

    function gameStart (){
        if (!outOfTime) {
            if (!gameStarted && !running) {
                running = true;
                $('.flip-container').each(function () {
                    $(this).toggleClass('flip');
                });
                precount();
            }
        }
    }

    $('.flip-container').click(function(){

        if (!outOfTime) {
            if (!gameStarted && !running){

            }
            else if ($(this).find('.back').attr('id') == chosenCards[0] && chosenCards[1] == null && $(this).hasClass('flip') && !running) {
                running = true;
                chosenCards[0] = null;
                $(this).toggleClass('flip');
                running = false;
            }
            else if ($(this).hasClass('flip')) {
                return;//if the card clicked is already flipped, return
            }
            else if (chosenCards[0] == null && chosenCards[1] == null && !$(this).hasClass('flip') && !running) {
                if (!countdownStarted) {
                    countdown();
                }
                running = true;
                chosenCards[0] = $(this).find('.back').attr('id');
                $(this).toggleClass('flip');
                running = false;
            }

            else if (chosenCards[0] != null && chosenCards[1] == null && !$(this).hasClass('flip') && !running) {
                running = true;
                chosenCards[1] = $(this).find('.back').attr('id');
                $(this).toggleClass('flip');

                if (chosenCards[0] == chosenCards[1]) {
                    chosenCards[0] = null;
                    chosenCards[1] = null;
                    pairCount++;
                    if (pairCount == cards.length) {
                        win = true;
                        setTimeout(function(){
                            $('#popComplete').css('display','block');
                            $('#dimBg_card').css('display','block');
                        },500);
                    }
                    running = false;
                }
                else {
                    cardsToFlip[0] = chosenCards[0];
                    cardsToFlip[1] = chosenCards[1];
                    chosenCards[0] = null;
                    chosenCards[1] = null;
                    setTimeout(function(){
                        $('*[id*=' + cardsToFlip[0] + ']').each(function() {
                            $(this).closest('.flip').toggleClass('flip');
                        });
                        $('*[id*=' + cardsToFlip[1] + ']').each(function() {
                            $(this).closest('.flip').toggleClass('flip');
                        });
                        running = false;
                    }, 800);
                }
            }
        } else {
            $('#popFail').css('display','block');
            $('#dimBg_card').css('display','block');
            reSet();
        };
    });

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function countdown () {
        countdownStarted = true;
        var timeStart = +new Date;
        var timer = setInterval( function() {
            var timeNow = +new Date;
            var difference = ( timeNow - timeStart ) / 1000;

            if (time > 0 && !win) {
                time = 15;
                time = Math.floor( time - difference );
                $('.timer').text( time );
            } else if (win) {
                clearInterval(timer);
            } else {
                outOfTime = true;
                //alert("you have run out of time :(");

                $('#popFail').css('display','block');
                $('#dimBg_card').css('display','block');
                reSet();
                clearInterval(timer);
            }
        }, 250 );
    };

    init = function(){
        $('#popStart').css('display','block');
        $('#dimBg_card').css('display','block');

        //gameStart
        $('#popStart').on('click', function(){
            $('#popStart').css('display', 'none');
            $('#dimBg_card').css('display','none');

            reSet();
            gameStart();
            return false;
        })

        $('#popFail, #popComplete .btnNext, #popComplete .btnService').on('click', function(){
            $('#dimBg_card').css('display','none');
            $('#popFail').css('display','none');

            //for start again
            $('#popComplete').hide();
            $('#dimBg_card').show();
            $('#popStart').show();
            reSet();
            return false;
        })
    }
    init();

});