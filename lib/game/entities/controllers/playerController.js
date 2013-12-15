ig.module(
        'game.entities.controllers.playerController'
    )

    .requires(
        'game.entities.controllers.entityController',
        'game.system.gamepadControllable',
        'game.entities.weapons.ammo.bullet',
        'game.entities.weapons.ammo.grenade'
    )

    .defines(function () {
        PlayerController = ig.EntityController.extend({
            gamepad: null,
            shootSoundFx: null,

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.gamepad = new GamepadControllable();
                this.shootSoundFx = new ig.Sound('media/sounds/shoot.*');
            },

            move: function () {
                if (ig.input.state('left') || this.gamepad.pad.dpadLeft == 1) {
                    this.moveLeft();
                } else if (ig.input.state('right') || this.gamepad.pad.dpadRight == 1) {
                    this.moveRight();
                } else {
                    this.stand();
                }
            },

            checkJumpInput: function () {
                return ig.input.pressed('jump') ||
                    this.gamepad.buttonReleased(this.gamepad.prevGamepadState.faceButton0, this.gamepad.pad.faceButton0);
            },

            shoot: function () {
                if (ig.input.released('shoot') || this.gamepad.buttonReleased(this.gamepad.prevGamepadState.faceButton2, this.gamepad.pad.faceButton2)) {
                    this.spawnProjectile(EntityBullet);
                    this.shootSoundFx.play();
                }
            },

            callElevatorDown: function () {
                return ig.input.state('down') || this.gamepad.pad.dpadDown == 1;
            },

            callElevatorUp: function () {
                return ig.input.state('up') || this.gamepad.pad.dpadUp == 1;
            },

            update: function () {
                this.parent();
                this.gamepad.update();
                this.shoot();
                this.move();
            },

            check: function (other) {
                this.parent(other);
            }

        });
    });
