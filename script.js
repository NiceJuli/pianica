
    function APP() {

        this.bind();
    }

    APP.prototype = {

        init:function(){
            this.cards = [];
            this.count = 0;
            this.players = [];
            this.carentPlayers = [];
            this.winnerCards = [];
            this.table = [];

        },

        bind: function () {

            $('#start-btn').on('click', function(){
                this.init();
                this.count = $('#count').val();
                this.create();
                this.shuffle();
                this.toPlayers();
                this.renderStart();
                this.carentPlayers = this.players;
                $('.btn').val('Начать заново');
                $('#go-btn').show();
            }.bind(this));

            $('#go-btn').on('click', function(){
                this.renderCard();
                this.compare();
                this.renderResult();
                this.winner();
            }.bind(this));
        },

        //создали колоду
        create: function() {
            //заполняем массив
            for (var i = 0; i < 52; i++)
                //все данные карты рассчитываются по ее номеру
                this.cards[i] = new Card(i);
        },

        //тасуем колоду
        shuffle: function() {
            this.cards.sort(function() {
                    return (Math.random() < 0.5 ? 1 : -1);
                }
            );
        },
        // раздаем карты игрокам
        toPlayers:function(){
            var i = 0;
            $.each(this.cards, function(n, v) {

                if (i >= this.count) i=0;

                if (this.players[i] == undefined) {
                    this.players[i] = [];
                }

                this.players[i].push(v);

                i++;
            }.bind(this));
        },
        // рисуем карту рубашкой вверх
        renderStart:function(){

            var data = '';
            $.each(this.players, function(n, v){
                data += '<div class="player"><div class="name-player">Игрок № '+(n+1)+'</div><div class="card-first"></div><div class="count-cards"><span class="number-c">'+v.length+'</span><span> карт в колоде</span></div></div></div>';
            });
            $('#players').html(data);
        },
        // показываем первую карту игрока
        renderCard:function(){
            $.each(this.carentPlayers, function(n, v){
                var player = $('#players .player').eq(n);

                if (v[0] == undefined) return;
                var card = v[0];
                this.table.push(card);
                this.carentPlayers[n].splice(0,0);
                this.players[n].splice(0,1);

                var cardsBox = player.addClass('active-card');
                cardsBox.find('.card-first').html(card.name+' '+card.suit);
                cardsBox.find('.count-cards .number-c').html(this.players[n].length);

            }.bind(this))
        },
        // находим самую большую карту или спорная ситуация
        compare:function(){
            var winCard = null;
            var compare = [];

            $.each(this.carentPlayers, function(n, v){
               if (v[0] == undefined) return;
               var card = v[0];
               if(winCard == null || card.value > winCard[1] ){
                   winCard = [n, card.value];
               }
            });
            $.each(this.carentPlayers, function(n, v){
                if (v[0] == undefined) return;
                var card = v[0];
                if(winCard[1] == card.value){
                    compare.push([n, card.value]);
                }
            });

            this.winnerCards = (compare.length > 1) ? compare : [winCard];
        },
        // показываем победителя
        renderResult:function(){
            $.each(this.winnerCards, function(n, v){
                $('#players .player').eq(v[0]).addClass('winner');
            });
            $('#players .player:not(.winner)').addClass('louser');
            var result = $('#result');
            if (this.compare.length > 1){
                result.text('Спор');
            } else{
                result.text('Следующий ход');
            }
        },
        winner:function(){

           if( this.winnerCards.length>1){
               var players = [];
               $.each(this.winnerCards, function(n,v){
                   var player = this.players[v[0]];
                   players.push(player);
               }.bind(this));
               this.carentPlayers = players;
           } else {
               this.carentPlayers = this.players;
               var winPlayer = this.winnerCards[0][1];
               this.players[winPlayer] = this.players[winPlayer].splice(winPlayer);
           }
        }
    };

    function Card(n) {
        var suits = ['треф', 'бубен', 'червей', 'пик'];
        var names = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Валет', 'Дама', 'Король', 'Туз'];
        var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

        //рассчитываем свойства карты по ее номеру
        this.suit = suits[parseInt(n / 13)]; //масть
        this.name = names[n % 13]; //название
        this.value = values[n % 13]; //очки
    }

$(document).ready(function(){
    new APP();
});