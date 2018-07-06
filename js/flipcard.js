var FLIPCARD = (function () {
    var _public = {};
    var _private = {};

    var cards = ['item1', 'item2', 'item3', 'item4']; //카드 id속성
    var pairs = cards.concat(cards); //각각의 other pair 생성
    var chosenCards = [];
    var cardsToFlip = [];
    var gameStarted = false;
    var running = false;
    var outOfTime = false;
    var countdownStarted = false;
    var precountStarted = false;
    var win = false;
    var pairCount = 0;
    var time = 15; //set count
    var pretime = 5; //set pre-count

    _private.shuffleCards = function(a){ //a : array type
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = a[i]; //임시저장
                a[i] = a[j]; //복사
                a[j] = temp; //기존에꺼 임시저장으로 치환 : 두개 바꿔치기
        }

        $('.back').each(function(i) { //카드배치
            $(this).attr('id', a[i]);
        });
        return a;
    };

    _private.reset = function(){
        gameStarted = false;
        running = false;
        outOfTime = false;
        countdownStarted = false;
        precountStarted = false;
        win = false;
        chosenCards = [];
        cardsToFlip = [];
        pairCount = 0;
        time = 15; //set count
        pretime = 5; //set pre-count

        $('.timer').text( pretime );
        $('.flip-container').removeClass('flip');
        $('#popStart').css('display','block');
        $('#dimBg_card').css('display','block');
        $('#popComplete').hide();

        _private.shuffleCards(pairs); //카드 다시섞기

    };

    _private.precount = function(){
        precountStarted = true;

        var pretimeStart = +new Date; //시작초
        var pretimer = setInterval( function() {
            var pretimeNow = +new Date;
            var predifference = ( pretimeNow - pretimeStart ) / 1000;  //현재초 - 시작초

            if (pretime > 0 ) {
                pretime = 5;
                pretime = Math.floor( pretime - predifference );
                $('.timer').text( pretime );
            } else {
                clearInterval(pretimer);

                //all card flip
                $('.flip-container').each(function() {
                    $(this).toggleClass('flip');
                });
                setTimeout(function(){ $('.timer').text( time ); },500); //set count
                gameStarted = true;
                running = false;
            }
        }, 250 );
    };

    _private.countdown = function() {
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

                $('#popFail').css('display','block');
                $('#dimBg_card').css('display','block');
                _private.reset();
                clearInterval(timer);
            }
        }, 250 );
    };

    _private.gamestart = function(){

        $('#popStart').css('display', 'none');
        $('#dimBg_card').css('display','none');

        if (!outOfTime) {
            if (!gameStarted && !running) {
                running = true;
                $('.flip-container').each(function () {
                    $(this).toggleClass('flip');
                });
                _private.precount();
            }
        }
    };

    _private.eventHandler = function () {
        _private.shuffleCards(pairs);
        _private.reset();
    };

    _public.init = function() {
        _private.eventHandler();

        $('#popStart').on('click', function(e){ //game start
            e.preventDefault();
            _private.gamestart();
        });

        $('#popFail, #popComplete .btnNext, #popComplete .btnService').on('click', function(){
            $('#dimBg_card').css('display','none');
            $('#popFail').css('display','none');

            _private.reset(); //다시시
            return false;
        })

        $('.flip-container').click(function(){
            if (!outOfTime) { //시간이 끝나지 않았을 전제하에,
                if ($(this).hasClass('flip')) { //클릭된 카드는 클릭할수 없어요
                    return;
                }else if (chosenCards[0] == null && chosenCards[1] == null && !$(this).hasClass('flip') && !running) { //앞선 카드를 뒤집은 경우
                    if (!countdownStarted) { // 첫번째 카드를 뒤집으면 게임이 시작된다.
                        _private.countdown();
                    }
                    running = true;
                    chosenCards[0] = $(this).find('.back').attr('id'); //앞선 카드를 저장한다.
                    $(this).toggleClass('flip');
                    running = false; //모션 충돌을 방지하기 위하여, 막아준다.
                }else if (chosenCards[0] != null && chosenCards[1] == null && !$(this).hasClass('flip') && !running) { //앞선 카드와 비교해 볼 차례
                    running = true;
                    chosenCards[1] = $(this).find('.back').attr('id');
                    $(this).toggleClass('flip');

                    if (chosenCards[0] == chosenCards[1]) { //카드 두장이 매치되었을 경우
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
                    }else { //카드 두장이 매치되지 않을 경우
                        cardsToFlip[0] = chosenCards[0]; //뒤집기 위한 임시 저장
                        cardsToFlip[1] = chosenCards[1]; //뒤집기 위한 임시 저장
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
            } else { //타임오버
                $('#popFail').css('display','block');
                $('#dimBg_card').css('display','block');
                _private.reset();
            };
        });

    };
    return _public;
})();

//init
$(function() {
    FLIPCARD.init();
});