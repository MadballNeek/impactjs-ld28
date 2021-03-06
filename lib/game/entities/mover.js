/*
 Simple Mover that visits all its targets in an ordered fashion. You can use
 the void entities (or any other) as targets.


 Keys for Weltmeister:

 speed
 Traveling speed of the mover in pixels per second.
 Default: 20

 target.1, target.2 ... target.n
 Names of the entities to visit.
 */

ig.module(
        'game.entities.mover'
    )
    .requires(
        'impact.entity',
        'game.system.gamepadControllable',
        'game.system.eventChain'
    )
    .defines(function () {

        EntityMover = ig.Entity.extend({
            maxVel: {x: 100, y: 100},

            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.FIXED,

            target: null,
            targets: [],
            currentTarget: 0,
            speed: 20,
            gravityFactor: 0,
            targetReached: false,
            movingUp: false,
            movingDown: true,
            hasRider: false,
            callSoundFx: null,

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                // Transform the target object into an ordered array of targets
                this.targets = ig.ksort(this.target);
                this.targetReachedEventChain = EventChain(this)
                    .then(function () {
                        this.vel.x = 0;
                        this.vel.y = 0;
                    })
                    .wait(0.5)
                    .then(function () {
                        this.targetReached = false;
                    })
                    .repeat();
                this.callSoundFx = new ig.Sound('media/sounds/call.*');
            },


            update: function () {
                var oldDistance = 0;
                var target = ig.game.getEntityByName(this.targets[this.currentTarget]);
                if (target) {
                    oldDistance = this.distanceTo(target);

                    var angle = this.angleTo(target);
                    if (!this.targetReached) {
                        this.vel.x = Math.cos(angle) * this.speed;
                        this.vel.y = Math.sin(angle) * this.speed;
                    }
                } else {
                    this.vel.x = 0;
                    this.vel.y = 0;
                }

                if (this.targetReached) {
                    this.targetReachedEventChain();
                }
                // if vel.y is postive, than we are moving downwards.
                this.movingDown = this.vel.y > 0;
                this.parent();
                // Are we close to the target or has the distance actually increased?
                // -> Set new target
                var newDistance = this.distanceTo(target);
                if (target && (newDistance > oldDistance || newDistance < 0.5)) {
                    this.pos.x = target.pos.x + target.size.x / 2 - this.size.x / 2;
                    this.pos.y = target.pos.y + target.size.y / 2 - this.size.y / 2;
                    // If we are moving downwards, increase target, else decrease it to continue moving upwards.
                    if (ig.game.player.callElevatorDown()) {
                        this.movingDown = this.currentTarget++;
                        this.callSoundFx.play();
                    } else if (ig.game.player.callElevatorUp()) {
                        this.movingDown = this.currentTarget--;
                        this.callSoundFx.play();
                    }

                    if (this.currentTarget >= this.targets.length && this.targets.length > 1) {
                        this.currentTarget -= 2;
                    } else if (this.currentTarget === -1) {
                        this.currentTarget += 2;
                    }
                    this.targetReached = true;
                }
                this.hasRider = false;
            },

            check: function (other) {
                if (other) {
                    this.hasRider = other.name === 'player';
                }
            }
        });
    });