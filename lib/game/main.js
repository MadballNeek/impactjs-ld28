ig.module(
        'game.main'
    )
    .requires(
        'game.screens.mainMenuScreen'
        , 'impact.debug.debug'
    )
    .defines(function () {
        if (ig.ua.iPad) {
            ig.Sound.enabled = false;
            ig.main('#canvas', MainMenuScreen, 60, 240, 160, 2);
        }
        else if (ig.ua.mobile) {
            ig.Sound.enabled = false;
            ig.main('#canvas', MainMenuScreen, 60, 160, 160, 2);
        }
        else {
            var scale = 3;
            ig.main('#canvas', GameScreen, 60, 200, 125, scale);
            //ig.system.resize(ig.global.innerWidth * 1 * (1 / scale), ig.global.innerHeight * 1 * (1 / scale), scale);
        }
    });
