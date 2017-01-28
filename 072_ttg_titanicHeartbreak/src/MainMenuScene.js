var MainMenuLayer = cc.Layer.extend({

    ctor:function () 
    {
        this._super();
        this.init();
        
        return true;
    },
    
    init:function() 
    {
        this._super();
        this.loadBatches();
        // Batch node
    
        // Background image
        var sprite = new cc.Sprite(res.titleScreen_png);
        sprite.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y);
        this.addChild(sprite, 0);

        // Main menu buttons
        var playButton = new cc.MenuItemImage(
            "#ui_btnPlayU.png",
            "#ui_btnPlayD.png",
            this.showLevelScene,
            this);
        
        playButton.anchorX = 1.0;
        playButton.anchorY = 1.0;
        playButton.x = 0;
        playButton.y = 2;
        
        var howToButton = new cc.MenuItemImage(
            "#ui_btnHowToPlayU.png",
            "#ui_btnHowToPlayD.png",
            this.showRules,
            this);
        
        howToButton.anchorX = 1.0;
        howToButton.anchorY = 1.0;
        howToButton.x = playButton.x;
        howToButton.y = -howToButton.getContentSize().height;

        var mainMenu = new cc.Menu(playButton, howToButton);
        mainMenu.x = GC.SCREEN.CENTER.X + 200;
        mainMenu.y = 260;
        this.addChild(mainMenu, 1);
        
        return true;
    },

    loadBatches:function()
    {
        //char
        cc.spriteFrameCache.addSpriteFrames(res.char_beastboyUpper_plist);
        cc.spriteFrameCache.addSpriteFrames(res.char_beastboyLower_plist);
        cc.spriteFrameCache.addSpriteFrames(res.char_ravenUpper_plist);
        cc.spriteFrameCache.addSpriteFrames(res.char_ravenLower_plist);
        cc.spriteFrameCache.addSpriteFrames(res.char_cyborgUpperL_plist);
        cc.spriteFrameCache.addSpriteFrames(res.char_cyborgUpperR_plist);
        cc.spriteFrameCache.addSpriteFrames(res.char_cyborgLower_plist);


        cc.spriteFrameCache.addSpriteFrames(res.fx_plist);
        cc.spriteFrameCache.addSpriteFrames(res.gobj_plist);
        cc.spriteFrameCache.addSpriteFrames(res.gameScreen_brick_plist);
        cc.spriteFrameCache.addSpriteFrames(res.gameScreen_customCol_plist);
        cc.spriteFrameCache.addSpriteFrames(res.levelSelect_char_plist);
        cc.spriteFrameCache.addSpriteFrames(res.loadingScreen_plist);

        cc.spriteFrameCache.addSpriteFrames(res.ui_plist);
        var uiBatch = new cc.SpriteBatchNode(res.ui_png);
        this.addChild(uiBatch);
    },
    
    startGame:function () {
        // Note: Open your gameplay scene here.
        var gameScene = new GameplayScene();
        cc.director.runScene(new cc.TransitionFade(0.5, gameScene));
    },

    showLevelScene:function()
    {
        var levelScene = new LevelSelectScene();
        cc.director.runScene(new cc.TransitionFade(0.5, levelScene));
    },
    
    showRules:function() {
        var howToPlayScene = new HowToPlayScene(GC.HOW_TO_PLAY_PAGE.ONE);
        cc.director.runScene(new cc.TransitionMoveInR(0.5, howToPlayScene));
    }
});

var MainMenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainMenuLayer();
        this.addChild(layer);
    }
});
