ig.module(
        'game.screens.mainMenuScreen'
    )

    .requires(
        'impact.game',
        'plugins.impact-storage',
        'game.screens.gameScreen'
    )

    .defines(function () {
        MainMenuScreen = ig.Game.extend({
            font: new ig.Font('media/fonts/04b03.font.png'),
            startGame: false,
            storage: new ig.Storage(),

            init: function () {
                if (ig.ua.mobile) {
                    ig.Sound.enabled = false;
                }
                this.bindKeys();
                if (this.storage.get('playedBefore')) {
                    this.startGame = false;
                }
            },

            bindKeys: function () {
                ig.input.bind(ig.KEY.ENTER, 'enter');
            },

            update: function () {
                this.parent();
                if (ig.input.state('enter') && this.startGame) {
                    this.storage.set('playedBefore', true);
                    this.startGame = true;
                    ig.system.setGameNow(GameScreen);
                }
            },

            draw: function () {
                this.parent();

                var x = ig.system.width / 2,
                    y = ig.system.height / 2;
                if (this.storage.get('playedBefore')) {
                    this.startGame = false;
                    this.font.draw("You Only Get One Chance\n" +
                        "A Ludum Dare 28 Entry", x, y - 55, ig.Font.ALIGN.CENTER);
                    this.font.draw("Developed by Nicholas DiMucci\n" +
                        "http://mindshaftgames.appspot.com/\n\n" +
                        "Look like you've already played.\n" +
                        "You only get one chance to play this game.\n\n" +
                        "Let's be honest, I doubt you really wanted\n" +
                        "to play again anyways.", x, y - 30, ig.Font.ALIGN.CENTER);
                } else {
                    this.startGame = true;
                    this.font.draw("You Only Get One Chance\n" +
                        "A Ludum Dare 28 Entry", x, y - 55, ig.Font.ALIGN.CENTER);
                    this.font.draw("Developed by Nicholas DiMucci\n" +
                        "http://mindshaftgames.appspot.com/\n\n" +
                        "Left/Right arrows to move.\nUp/Down arrows to move elevator.\n" +
                        "X jumps. C shoots.\n" +
                        "You only have one life.\n" +
                        "You only have one chance to play this game.\n" +
                        "Break crates. Find bottle. Win.\n" +
                        "Press [enter] to start!", x, y - 30, ig.Font.ALIGN.CENTER);
                }
            }
        })
    });