ig.module(
        'game.screens.gameScreen'
    )
    .requires(
        'impact.game',
        'impact.font',
        'game.system.camera',
        'plugins.gamepad',
        'game.levels.proto',
        'game.levels.level1'
    )
    .defines(function () {
        GameScreen = ig.Game.extend({
            camera: null,
            player: null,
            gravity: 500,
            font: new ig.Font('media/fonts/04b03.font.png'),
            messageTimer: new ig.Timer(),
            playerIsDead: false,
            gameWon: false,

            init: function () {
                this.setupCamera();
                this.bindKeys();

                this.messageTimer.set(10);
                this.loadLevel(LevelLevel1);
            },

            setupCamera: function () {
                this.camera = new Camera(ig.system.width / 2, ig.system.height / 3, 5);
                this.camera.trap.size.x = ig.system.width / 15;
                this.camera.trap.size.y = ig.system.height / 3;
                this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width / 6 : 0;
            },

            bindKeys: function () {
                ig.input.bind(ig.KEY.ENTER, 'enter');

                ig.input.bind(ig.KEY.C, 'shoot');
                ig.input.bind(ig.KEY.D, 'grenade');
                ig.input.bind(ig.KEY.X, 'jump');

                ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                ig.input.bind(ig.KEY.UP_ARROW, 'up');
                ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
            },

            loadLevel: function (level) {
                this.parent(level);

                this.player = this.getEntitiesByType(EntityPlayer)[0];
                this.player.zIndex = 10;

                // Set camera max and reposition trap
                this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
                this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;

                this.camera.setEntityToFollow(this.player);
            },

            update: function () {
                this.camera.update();

                if (this.player.carryingBottle) {
                    this.gameWon = true;
                }

                if (ig.input.state('enter')) {
                    if (this.player.isDead || this.gameWon) {
                        ig.system.setGameNow(MainMenuScreen);
                    }
                }
                this.parent();
            },

            draw: function () {
                this.parent();
                var x = ig.system.width / 2,
                    y = ig.system.height / 2;

                if (this.gameWon) {
                    this.font.draw('You found the bottle!\nGame over.', x, y, ig.Font.ALIGN.CENTER);
                    this.font.draw("Press [enter] to restart", x, y + 20, ig.Font.ALIGN.CENTER);
                }
                if (this.player.isDead) {
                    this.font.draw('You are dead.\nGame over.', x, y, ig.Font.ALIGN.CENTER);
                    this.font.draw("Press [enter] to restart", x, y + 20, ig.Font.ALIGN.CENTER);
                } else {
                    if (this.messageTimer.delta() < 0) {
                        this.font.draw('Find the bottle in a crate.', x, y - 60, ig.Font.ALIGN.CENTER);
                    }
                }
            }
        });
    });

//window.onresize = function () {
//    ig.system.resize(ig.global.innerWidth * 1 * (1 / 4), ig.global.innerHeight * 1 * (1 / 4), 4);
//    ig.game.camera.onWindowResize();
//};
