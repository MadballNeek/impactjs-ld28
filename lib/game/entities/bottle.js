ig.module(
        'game.entities.bottle'
    )

    .requires(
        'impact.entity'
    )

    .defines(function () {
        EntityBottle = ig.Entity.extend({
            name: 'bottle',
            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.B,

            animSheet: new ig.AnimationSheet('media/bottle.png', 8, 8),
            size: {x: 8, y: 8},

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('idle', 1, [0]);
                this.currentAnim = this.anims.idle;
            },

            update: function () {
                this.parent();
            },

            check: function (other) {
                if (other && other.name === 'player') {
                    ig.game.player.carryingBottle = true;
                    this.kill();
                }
            }
        });
    });
