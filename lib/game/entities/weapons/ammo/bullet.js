ig.module(
        'game.entities.weapons.ammo.bullet'
    )

    .requires(
        'game.entities.abstract.projectile'
    )

    .defines(function () {
        EntityBullet = EntityProjectile.extend({
            collides: ig.Entity.COLLIDES.PASSIVE,
            maxVel: {x: 250, y: 0},
            accelAir: 150,
            size: {x: 6, y: 2},
            offset: {x: 2, y: 3},
            // You only get one, so lets make sure it does a lot of damage.
            damageAmount: 2,
            decayTime: 0.5,
            animSheet: new ig.AnimationSheet('media/projectile.png', 8, 8),

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('shot', 1, [0]);
                this.addAnim('hit', 0.1, [1, 2, 3, 4, 5], true);
                this.currentAnim = this.anims.shot;
                this.currentAnim.flip.x = settings['flip'];
            },

            collideWith: function (other, axis) {
                this.currentAnim = this.anims.hit;
                this.kill();
                this.parent(other, axis);
            },

            handleMovementTrace: function (res) {
                // Check for collision against walls and other tiles in the collision map.
                if (res.collision.y || res.collision.x) {
                    this.currentAnim = this.anims.hit;
                    this.kill();
                }
                this.parent(res);
            }
        });
    });