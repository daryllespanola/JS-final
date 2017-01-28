var GameOverLayer = cc.Layer.extend({
    
    isNewHighScore:null,
    
    ctor:function() {
        this._super();
        this.init();
    },
    
    init:function() {
        this._super();
        
        // Note: Already done in MainMenuScene.js.
        //cc.spriteFrameCache.addSpriteFrames(res.main_menu_plist);
        // Background
        var sprite = new cc.Sprite(res.endScreen_bg_png);
        sprite.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y);
        this.addChild(sprite, 0);

        var Panel = new cc.Sprite(res.endScreen_lose_png);
        Panel.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y + 35);
        this.addChild(Panel, 1);
        
        // Score values
        var highScoreColor = cc.color(232, 66, 61);
        var yourScoreColor = cc.color(157, 140, 195);
        
        var highScoreLabel = cc.LabelBMFont.create("999", res.text1_fnt);
        highScoreLabel.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y - 175);
        this.addChild(highScoreLabel, 1);
        
        var yourScoreLabel = cc.LabelBMFont.create("999", res.text1_fnt);
        yourScoreLabel.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y + 15);
        this.addChild(yourScoreLabel, 1);
        
        // High score banner
        /*
        var highScoreBanner = new cc.Sprite("#gameover_new_high_score.png");
        highScoreBanner.x = highScoreLabel.x - 50; //GC.SCREEN.SIZE.WIDTH - highScoreBanner.getContentSize().width / 2 - 20,
        highScoreBanner.y = GC.SCREEN.SIZE.HEIGHT - highScoreBanner.getContentSize().height / 2 - 20;
        gameOverSpritesheet.addChild(highScoreBanner, 0);
        
        // Set high score
        this.isNewHighScore = false;
        
        highScoreLabel.setString(this.getHighScore());
        yourScoreLabel.setString(GC.SCORE);
        
        if (this.isNewHighScore) {
            highScoreBanner.visible = true;
        } else {
            highScoreBanner.visible = false;
        }
        */
        // Main menu buttons
        var playButton = new cc.MenuItemImage(
            "#ui_btnPlayAgainU.png",
            "#ui_btnPlayAgainD.png",
            this.replayGame,
            this);
        
        var mainMenu = new cc.Menu(playButton);
        mainMenu.x = GC.SCREEN.CENTER.X;
        mainMenu.y = GC.SCREEN.CENTER.Y - 290;
        this.addChild(mainMenu, 1);
    },
    
    getHighScore:function() {
        var highScore = cc.sys.localStorage.getItem(GC.UNIQUE_SCORE_KEY);
        
        if (GC.SCORE > highScore || highScore == null) {
            cc.sys.localStorage.setItem(GC.UNIQUE_SCORE_KEY, GC.SCORE);
            if (highScore != null) {
                this.isNewHighScore = true;
            }
            return GC.SCORE;
        } else {
            return highScore;
        }
    },
    
    replayGame:function() {
        // Note: Replace MainMenuScene with your gameplay scene.
        var gameScene = new GameplayScene();
        cc.director.runScene(new cc.TransitionFade(0.5, gameScene));
    }
});

var GameOverScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameOverLayer();
        this.addChild(layer);
    }
});