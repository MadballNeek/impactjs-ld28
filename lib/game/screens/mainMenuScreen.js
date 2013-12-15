ig.module(
        'game.screens.mainMenuScreen'
    )

    .requires(
        'impact.game',
        'game.screens.gameScreen'
    )

    .defines(function () {
        MainMenuScreen = ig.Game.extend({
            font: new ig.Font('media/fonts/04b03.font.png'),
            startGame: false,

            init: function () {
                if (ig.ua.mobile) {
                    ig.Sound.enabled = false;
                }
                this.bindKeys();
            },

            bindKeys: function () {
                ig.input.bind(ig.KEY.ENTER, 'enter');
            },

            update: function () {
                this.parent();
                if (ig.input.state('enter')) {
                    this.startGame = true;
                    ig.system.setGameNow(GameScreen);
                }
            },

            draw: function () {
                this.parent();

                var x = ig.system.width / 2,
                    y = ig.system.height / 2;

                this.font.draw("You Only Get One Chance\n" +
                    "A Ludum Dare 28 Entry", x, y - 55, ig.Font.ALIGN.CENTER);
                this.font.draw("Developed by Nicholas DiMucci\n" +
                    "http://mindshaftgames.appspot.com/\n\n" +
                    "Left/Right arrows to move.\nUp/Down arrows to move elevator.\n" +
                    "X jumps. C shoots.\n" +
                    "You only have one life.\n" +
                    "Break crates. Find bottle. Win.\n" +
                    "Press [enter] to start!", x, y - 30, ig.Font.ALIGN.CENTER);
                if (this.startGame) {
                    this.font.draw("Loading...", x, y + 53, ig.Font.ALIGN.CENTER);
                }
            }
        })
    });