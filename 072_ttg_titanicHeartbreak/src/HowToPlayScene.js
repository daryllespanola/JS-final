var HowToPlayPageLayer = cc.Layer.extend({
    ctor:function(currentPage) {
        this._super();
        
        var tut1 = res.tutorialScreen_png;
        var tut2 = res.tutorialScreen2_png;
        // Background
        var spriteResource;
        if (currentPage == GC.HOW_TO_PLAY_PAGE.ONE) {
            spriteResource = tut1;
        } else {
            spriteResource = tut2;
        }
        var sprite = new cc.Sprite(spriteResource);
        sprite.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y);
        this.addChild(sprite, 0);
        
    }
});

var HowToPlayNavigationLayer = cc.Layer.extend({
    currentPage:null,
    
    ctor:function(currentPage) {
        this._super();
        
        this.currentPage = currentPage;
        
        // Left
        var leftButton = new cc.MenuItemImage(
            "#ui_btnLeft.png",
            "#ui_btnLeft.png",
            this.goToPrevPage,
            this);
        
        leftButton.setAnchorPoint(0.0, 0.5);
        leftButton.x = 0;
        
        // Right
        var rightButton = new cc.MenuItemImage(
            "#ui_btnRight.png",
            "#ui_btnRight.png",
            this.goToNextPage,
            this);
        
        rightButton.setAnchorPoint(1.0, 0.5);
        rightButton.x = GC.SCREEN.SIZE.WIDTH;
        
        // Menu
        var navMenu;
        
        // Play
        var playButton = new cc.MenuItemImage(
            "#ui_btnPlayU.png",
            "#ui_btnPlayD.png",
            this.startGame,
            this);
        
        playButton.setAnchorPoint(1.0, 0.0);
        playButton.setPosition(GC.SCREEN.SIZE.WIDTH, 0);
        playButton.setScale(0.5, 0.5);
        
        var playMenu = new cc.Menu(playButton);
        playMenu.x = -300;
        playMenu.y = 10;

        if (currentPage == GC.HOW_TO_PLAY_PAGE.COUNT) {
            navMenu = new cc.Menu(leftButton);
            playMenu.visible = true;

        } else {
            navMenu = new cc.Menu(leftButton, rightButton);
            playMenu.visible = false;
        }
        
        navMenu.setPosition(0, GC.SCREEN.CENTER.Y);
        this.addChild(playMenu);
        this.addChild(navMenu);
    },
    
    goToPrevPage:function() {
        var nextScene;
        if (this.currentPage == GC.HOW_TO_PLAY_PAGE.ONE) {
            nextScene = new MainMenuScene();
            cc.director.runScene(new cc.TransitionMoveInL(0.5, nextScene));
        } else {
            nextScene = new HowToPlayScene(this.currentPage - 1);
            cc.director.runScene(new cc.TransitionMoveInL(0.5, nextScene));
        }
    },
    
    goToNextPage:function() {
        var nextScene = new HowToPlayScene(this.currentPage + 1);
        cc.director.runScene(new cc.TransitionMoveInR(0.5, nextScene));
    },
    
    startGame:function() {
        var gameScene = new GameplayScene();
        cc.director.runScene(new cc.TransitionMoveInR(0.5, gameScene));
    }
});

var HowToPlayScene = cc.Scene.extend({
    currentPage:null,
    
    ctor:function(currentPage) {
        this._super();
        
        this.currentPage = currentPage;
    },
    
    onEnter:function () {
        //cc.log("How to play scene current page = " + this.currentPage); // TODO remove
        
        this._super();
        var layer = new HowToPlayPageLayer(this.currentPage);
        var navButtons = new HowToPlayNavigationLayer(this.currentPage);
        
        this.addChild(layer);
        this.addChild(navButtons);
    }
});