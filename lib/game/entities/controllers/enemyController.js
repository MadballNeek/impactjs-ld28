ig.module(
        'game.entities.controllers.enemyController'
    )

    .requires(
        'game.entities.controllers.entityController'
    )

    .defines(function () {
        EnemyController = ig.EntityController.extend({
            ai: null,
            chaseSpeed: 100,

            setAi: function (ai) {
                this.ai = ai;
            },

            chaseLeft: function () {
                this.accel.x = -this.accelValue * 10;
                this.flip = true;
            },

            chaseRight: function () {
                this.accel.x = this.chaseSpeed;
                this.flip = false;
            },

            update: function () {
                this.parent();
                if (this.ai) {
                    this.ai.update();
                }
            }
        });
    });