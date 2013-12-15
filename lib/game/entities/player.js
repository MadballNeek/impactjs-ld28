ig.module(
        'game.entities.player'
    )

    .requires(
        'game.system.eventChain',
        'game.entities.controllers.playerController'
    )

    .defines(function () {
        EntityPlayer = PlayerController.extend({
            name: 'player',
            collides: ig.Entity.COLLIDES.PASSIVE,
            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,

            animSheet: new ig.AnimationSheet('media/player/player.png', 16, 16),
            size: {x: 8, y: 14},
            offset: {x: 4, y: 2},

            maxVel: {x: 100, y: 300},
            friction: {x: 1000, y: 0},
            jumpHeight: 125,

            health: 50,
            isDead: false,
            deathEventChain: null,
            invincibleTimer: null,
            invincibleDelta: 2,
            carryingBottle: false,
            fsm: null,
            fallingTimer: null,
            fallingDelta: 2,

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('idle', 1, [0]);
                this.addAnim('run', 0.1, [0, 1, 2, 3, 4, 5]);
                this.addAnim('jump', 1, [9]);
                this.addAnim('fall', 0.5, [6, 7]);

                this.projectileYAxisOffset = 0.5;
                this.projectileLeftOffeset = 0.9;
                this.projectileRightOffset = 1.2;

                this.currentAnim = this.anims.idle;

                this.invincibleTimer = new ig.Timer();
                this.invincibleTimer.set(this.invincibleDelta);
                this.fallingTimer = new ig.Timer();

                this.deathEventChain = EventChain(this)
                    .then(function () {
                    })
                    .repeat();
                // Setup FSM.
                this.fsm = new StateMachine();
                var self = this;
                this.fsm.state('idle', {
                    enter: function () {
                        self.currentAnim = self.anims.idle;
                    }
                });
                this.fsm.state('jump', {
                    enter: function () {
                        self.currentAnim = self.anims.jump;
                        self.jump();
                    }
                });
                this.fsm.state('fall', {
                    enter: function () {
                        self.currentAnim = self.anims.fall;
                        self.fallingTimer.set(self.fallingDelta);
                    },
                    update: function () {
                        if (self.fallingTimer.delta() > 0) {
                            ig.game.playerIsDead = true;
                            self.kill();
                        }
                    }
                });
                this.fsm.state('run', {
                    enter: function () {
                        self.currentAnim = self.anims.run;
                    }
                });
                // Setup the possible transitions.
                this.fsm.transition('jumping', 'idle', 'jump', function () {
                    return self.checkJumpInput();
                });
                this.fsm.transition("jumping1", 'run', 'jump', function () {
                    return self.checkJumpInput();
                });
                this.fsm.transition('running', 'idle', 'run', function () {
                    return self.vel.x !== 0;
                });
                this.fsm.transition('standing', 'run', 'idle', function () {
                    return self.vel.x === 0;
                });
                this.fsm.transition('standing1', 'jump', 'idle', function () {
                    return self.vel.y === 0;
                });
                this.fsm.transition('falling', 'jump', 'fall', function () {
                    return self.vel.y > 0;
                });
                this.fsm.transition('falling1', 'run', 'fall', function () {
                    return self.vel.y > 0;
                });
                this.fsm.transition('standing2', 'fall', 'idle', function () {
                    return self.standing;
                });
            },

            update: function () {
                this.fsm.update();
                this.currentAnim.flip.x = this.flip;
                this.parent();
            },

            check: function (other) {
                this.parent(other);
                if (other) {
                    if (other.name === 'spike') {
                        if (this.invincibleTimer.delta() > 0) {
                            this.receiveDamage(other.damageAmount, other);
                            this.invincibleTimer.reset();
                        }
                    }
                }
            }
        });
    });