ig.module(
        'game.entities.crate'
    )
    .requires(
        'impact.entity',
        'game.entities.bottle'
    )

    .defines(function () {
        EntityCrate = ig.Entity.extend({
            size: {x: 8, y: 8},

            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.BOTH,
            collides: ig.Entity.COLLIDES.ACTIVE,

            animSheet: new ig.AnimationSheet('media/crate.png', 8, 8),

            bounceCounter: 0,
            health: 10,
            hasBottle: false,

            init: function (x, y, settings) {
                this.addAnim('idle', 1, [0]);
                this.addAnim('broken', 1, [1]);
                this.parent(x, y, settings);
            },

            handleMovementTrace: function (res) {
                this.parent(res);
                if (res.collision.x || res.collision.y) {
                    // only bounce 3 times
                    this.bounceCounter++;
                    if (this.bounceCounter > 3) {
                        this.vel.x = 0;
                        this.vel.y = 0;
                        this.bounceCounter = 0;
                    }
                }
            },

            update: function () {
                if (this.health <= 5) {
                    this.currentAnim = this.anims.broken;
                }
                this.parent();
            },

            kill: function () {
                if (this.hasBottle) {
                    ig.game.spawnEntity(EntityBottle, this.pos.x, this.pos.y, []);
                }
                this.parent();
            }
        });
    });