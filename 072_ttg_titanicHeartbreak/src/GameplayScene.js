var g_sharedGameplayLyr;

var GameplayLayer = cc.Layer.extend({
    
    m_heart:undefined,
    m_heartContainer:[],
    m_player:undefined,
    m_weapon:undefined,
    m_weaponIndexPool:undefined,
    m_maxIndexPool:undefined,
    m_weaponPool:[],
    m_rainbowProj:[],
    m_pickUp:undefined,
    m_pickUpContainer:[],
    m_toDelete:[],
    m_toDeletePickUp:[],

    //LevelDesign
    m_brick:undefined,
    m_bricksContainer:[],
    m_metalDoorContainer:[],
    m_specialObj:undefined,

    //FX
    m_heartFX:undefined,
    m_forceFieldFX:undefined,
    act_ForceFieldExplode:undefined,
    m_isForceFieldActive:undefined,
    m_cameraShakeTimer:undefined,
    m_isCameraShaking:undefined,

    //State
    m_isStartGame:undefined,
    m_isPlayerDead:undefined,   
    m_isInvincible:undefined,   

    //BatchNodes
    m_gobjBatchNode:undefined,
    m_brickBatchNode:undefined,
    m_customColBatchNode:undefined,
    m_fxBatchNode:undefined,
    m_loadingScreenBatchNode:undefined,

    ctor:function() 
    {
        this._super();
        this.loadBatches();
        this.init();
    },

    loadBatches:function()
    {
        this.m_gobjBatchNode = new cc.SpriteBatchNode(res.gobj_png);
        this.addChild(this.m_gobjBatchNode, 1);

        this.m_brickBatchNode = new cc.SpriteBatchNode(res.gameScreen_brick_png);
        this.addChild(this.m_brickBatchNode, 1);

        this.m_customColBatchNode = new cc.SpriteBatchNode(res.gameScreen_customCol_png);
        this.addChild(this.m_customColBatchNode, 1);

        this.m_fxBatchNode = new cc.SpriteBatchNode(res.fx_png);
        this.addChild(this.m_fxBatchNode, 2);

        this.m_loadingScreenBatchNode = new cc.SpriteBatchNode(res.loadingScreen_png);
        this.addChild(this.m_loadingScreenBatchNode, 5);
    },

    init:function()
    {
        //Initialize here
        g_sharedGameplayLyr = this;
        this.showLoadingScreen();

        //Restart arrays 
        this.m_weaponPool = [];
        this.m_bricksContainer = [];
        this.m_heartContainer = [];
        this.m_metalDoorContainer = [];
        this.m_toDelete = [];
        this.m_toDeletePickUp = [];
        this.m_pickUpContainer = [];
        this.m_rainbowProj = [];

        this.m_cameraShakeTimer = 0;
        this.m_isCameraShaking = false;

        this.m_weaponIndexPool = 0;
        this.m_isForceFieldActive = false;
        this.m_isStartGame = false;
        this.m_isPlayerDead = false;
      
        this.initializeLevel();
        this.initializePlayer();
        this.initializeForceFieldFX();
        this.scheduleUpdate();

        //Delay pre game setup
        this.runAction(cc.sequence(cc.delayTime(0.2),
            cc.callFunc(function()
            {
                this.entryRobin();
            }, this)));
    },

    showLoadingScreen:function()
    {
        var titanPanel1 = new cc.Sprite("#loadingScreen1.png");
        titanPanel1.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y);
        this.m_loadingScreenBatchNode.addChild(titanPanel1);

        var titanPanel2 = new cc.Sprite("#loadingScreen2.png");
        titanPanel2.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y);
        this.m_loadingScreenBatchNode.addChild(titanPanel2);

        titanPanel1.runAction(cc.moveTo(0.5, cc.p(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y + 1200)));
        titanPanel2.runAction(cc.moveTo(0.5, cc.p(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y - 1200)));
        this.runAction(cc.sequence(cc.delayTime(2),
            cc.callFunc(function()
            {
                titanPanel1.removeFromParent();
                titanPanel2.removeFromParent();
            }, this)));
    },

    entryRobin:function()
    {
        var robin = new cc.Sprite(res.preGame_robin_png);
        robin.setPosition(0, GC.SCREEN.CENTER.Y + 70);
        this.addChild(robin, 5);

        robin.runAction(cc.sequence(cc.moveTo(0.8, 400, GC.SCREEN.CENTER.Y),
            cc.moveTo(1.1, GC.SCREEN.SIZE.WIDTH - 400, GC.SCREEN.CENTER.Y),
            cc.moveTo(1, GC.SCREEN.SIZE.WIDTH + 100, GC.SCREEN.CENTER.Y + 70),
            cc.callFunc(function()
                {
                    robin.cleanup();
                    robin.removeFromParent();
                    this.showGoSign();
                }, this)));

        //hover details
        var act_RobinHover = new cc.RepeatForever(cc.sequence(cc.moveBy(0.8, 0, -70),
                    cc.moveBy(0.8, 0, 70 ).easing( cc.easeSineIn())));

    },

    showGoSign:function()
    {
        var goSign = new cc.Sprite("#gobj_go.png");
        goSign.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y);
        goSign.setScale(0);
        this.addChild(goSign, 5);

        goSign.runAction(cc.sequence(cc.scaleTo(0.2, 1.2),
            cc.scaleTo(0.2, 1),
            cc.delayTime(0.2),
            cc.scaleTo(0.2, 0),
            cc.callFunc(function()
                {
                    //Start Game
                    this.m_isStartGame = true;
                    //GameOver Debug
                    //this.gameOver();
                    //this.m_player.playInitialAnimation();
                    for(var i = 0; i < this.m_heartContainer.length; i++)
                    {
                        var heartObj = this.m_heartContainer[i];

                        heartObj.startSimulation();
                    }

                    goSign.removeFromParent();
                }, this)));

        goSign.runAction(cc.sequence(cc.delayTime(0.6),
            cc.fadeOut(0.1)));
    },

    initializeLevel:function()
    {
        cc.log("Your Current Level is: " + GC.LEVEL);

        //Level Design
        this.setupLevelDesign();
    },

    initializePlayer:function()
    {   
        if(GC.CURRENT_CHARACTER == GC.CHARACTER_NAME.BEAST)
        {
            cc.log("The player is Beast");
            this.m_player = new Player("BeastBoy");
            this.addChild(this.m_player);
            this.m_player.setParts("char_beastboyUpperIdle_0.png", "char_beastboyLowerIdle_0.png");
            //this.m_player.setParts("char_beastboyUpperIdle_0.png", "char_beastboyLowerIdle_0.png");
            this.m_player.setAnimation("char_beastboyUpperIdle_", 0.05, 0, 17,"char_beastboyUpperWalk_", 0.05, 0, 11, 
                "char_beastboyUpperShoot_", 0.03, 0, 17,
                "char_beastboyUpperHit_", 0.03, 0, 14,
                "char_beastboyLowerIdle_", 0.05, 0, 17,  "char_beastboyLowerWalk_", 0.05, 0, 11,
                "char_beastboyLowerHit_", 0.03, 0, 14);
            this.addPlayerWeapon();
        }

        else if(GC.CURRENT_CHARACTER == GC.CHARACTER_NAME.CYBORG)
        {
            cc.log("The player is Cyborg");
            this.m_player = new Player("Cyborg");
            this.addChild(this.m_player);
            this.m_player.setParts("char_cyborgIdleUpperR_0.png", "char_cyborgIdleLowerR_0.png");
            //this.m_player.setParts("char_beastboyUpperIdle_0.png", "char_beastboyLowerIdle_0.png");
            this.m_player.setAnimation("char_cyborgIdleUpperR_", 0.05, 0, 17,"char_cyborgWalkUpperR_", 0.05, 0, 11, 
                "char_cyborgShootUpperR_", 0.05, 0, 17,
                "char_cyborgHitUpperR_", 0.05, 0, 17,
                "char_cyborgIdleLowerR_", 0.05, 0, 0,  "char_cyborgWalkLower_", 0.05, 0, 11,
                "char_cyborgHitLowerR_", 0.05, 0, 17);
            this.addPlayerWeapon();
        }

        else if(GC.CURRENT_CHARACTER == GC.CHARACTER_NAME.RAVEN)
        {
            cc.log("The player is Raven");
            this.m_player = new Player("Raven");
            this.addChild(this.m_player);
            this.m_player.setParts("char_ravenIdleUpper_0.png", "char_ravenIdleLower_0.png");
            //this.m_player.setParts("char_beastboyUpperIdle_0.png", "char_beastboyLowerIdle_0.png");
            this.m_player.setAnimation("char_ravenIdleUpper_", 0.05, 0, 17,"char_ravenIdleUpper_", 0.05, 0, 17, 
                "char_ravenShootUpper_", 0.05, 8, 17,
                "char_ravenHitUpper_", 0.05, 0, 17,
                "char_ravenIdleLower_", 0.05, 0, 17,  "char_ravenIdleLower_", 0.05, 0, 17,
                "char_ravenHitLower_", 0.05, 0, 17);
            this.addPlayerWeapon();
        }
    },

    /// Add object functions
    addBrick:function(p_texture, x, y)
    {
        this.m_brick = new Brick(p_texture);
        this.m_brick.setPosition(x, y);
        this.m_brickBatchNode.addChild(this.m_brick, 3);
        this.m_bricksContainer.push(this.m_brick);
    },

    addSpecialObj:function(x, y)
    {
        this.m_specialObj.setPosition(x, y);
        this.m_gobjBatchNode.addChild(this.m_specialObj, 3);
        this.m_bricksContainer.push(this.m_specialObj);
    },

    addCustomCollision:function(p_texture, x, y)
    {
        this.m_brick = new CustomCollider(p_texture);
        this.m_brick.setOpacity(155);
        this.m_brick.setPosition(x, y);
        this.m_customColBatchNode.addChild(this.m_brick, 3);
        this.m_bricksContainer.push(this.m_brick);
    },

    addInitialHeart:function(dir , initSize, x, y)
    {
        this.m_heart = new Heart(dir, initSize);
        this.m_heart.setPosition(x, y);
        this.m_gobjBatchNode.addChild(this.m_heart, 4);
        this.m_heartContainer.push(this.m_heart);
    },
    ///

    setupLevelDesign:function()
    {
        var currentLevel = GC.LEVEL;
        var levelBackground = new cc.Sprite(res.gameScreen_bg_png_1);

        if(currentLevel == 1)
        {
            levelBackground = new cc.Sprite(res.gameScreen_bg_png_1);

            ///Hearts
            this.addInitialHeart(false, 2, 560, 510);
            this.addInitialHeart(true, 2, 810, 510);

            ///With Custom Collisions
            //Left L Shape
            var leftL = new cc.Sprite("#gameScreen_lv1w4.png");
            leftL.setPosition(GC.SCREEN.CENTER.X - 316, GC.SCREEN.CENTER.Y + 110);
            this.m_brickBatchNode.addChild(leftL);
            this.addCustomCollision("#collider_lv1_w3_horz.png", GC.SCREEN.CENTER.X - 316, GC.SCREEN.CENTER.Y + 76);
            this.addCustomCollision("#collider_lv1_w3_vert.png", GC.SCREEN.CENTER.X - 331, GC.SCREEN.CENTER.Y + 125);

            //Right L Shape
            var rightL = new cc.Sprite("#gameScreen_lv1w3.png");
            rightL.setPosition(GC.SCREEN.CENTER.X + 322, GC.SCREEN.CENTER.Y + 110);
            this.m_brickBatchNode.addChild(rightL);
            this.addCustomCollision("#collider_lv1_w3_horz.png", GC.SCREEN.CENTER.X + 322, GC.SCREEN.CENTER.Y + 76);
            this.addCustomCollision("#collider_lv1_w3_vert.png", GC.SCREEN.CENTER.X + 337, GC.SCREEN.CENTER.Y + 125);
            ///

            ///Static Bricks
            for(var i = 0; i < 4; i++)
            {
                this.addBrick("#gameScreen_lv1w5.png", GC.SCREEN.CENTER.X + 366 - (i * 250), GC.SCREEN.CENTER.Y - 75);
            }
                
            for(var i = 0; i < 2; i++)
            {
                this.addBrick("#gameScreen_lv1w2.png", GC.SCREEN.CENTER.X - 107.5 + (i * 223), GC.SCREEN.CENTER.Y + 75);
                this.addBrick("#gameScreen_lv1w1.png", GC.SCREEN.CENTER.X - 331.5 + (i * 670), GC.SCREEN.CENTER.Y + 207);
            } 
                
            ///Special Bricks
            for(var i = 0; i < 3; i++)
            {
                this.m_specialObj = new Glass(4);
                this.addSpecialObj(GC.SCREEN.CENTER.X - 220 + (i * 223), GC.SCREEN.CENTER.Y + 75);
            }
            
            for(var i = 0; i < 2; i++)
            {
                this.m_specialObj = new PowerUp();
                this.addSpecialObj(GC.SCREEN.CENTER.X - 220 + (i * 440), GC.SCREEN.CENTER.Y + 215);
            }
            
        }

        else if(currentLevel == 2)
        {
            levelBackground = new cc.Sprite(res.gameScreen_bg_png_2);

            ///Hearts
            this.addInitialHeart(false, 1, 300, 560);
            this.addInitialHeart(true, 1, GC.SCREEN.SIZE.WIDTH - 300, 560);
            this.addInitialHeart(true, 1, 650, 430);
            this.addInitialHeart(false, 1, 720, 430);
            this.addInitialHeart(true, 1, 510, 430);
            this.addInitialHeart(false, 1, 850, 430);

            ///Static Bricks
            for(var i = 0; i < 2; i++)
            {
                this.addBrick("#gameScreen_lv2w5.png", GC.SCREEN.CENTER.X - 270.5 + (i * 541), GC.SCREEN.CENTER.Y + 55);
                this.addBrick("#gameScreen_lv2w5.png", GC.SCREEN.CENTER.X - 450 + (i * 127), GC.SCREEN.CENTER.Y + 200);
                this.addBrick("#gameScreen_lv2w5.png", GC.SCREEN.CENTER.X + 450 - (i * 127), GC.SCREEN.CENTER.Y + 200);
            }
            this.addBrick("#gameScreen_lv2w1.png", GC.SCREEN.CENTER.X - 95, GC.SCREEN.CENTER.Y + 120);
            this.addBrick("#gameScreen_lv2w2.png", GC.SCREEN.CENTER.X + 95, GC.SCREEN.CENTER.Y + 120);
            this.addBrick("#gameScreen_lv2w3.png", GC.SCREEN.CENTER.X - 95, GC.SCREEN.CENTER.Y - 5);
            this.addBrick("#gameScreen_lv2w4.png",GC.SCREEN.CENTER.X + 95, GC.SCREEN.CENTER.Y - 5);

            ///Special Objs
            for(var i = 0; i < 3; i++)
            {
                this.m_specialObj = new Glass(4);
                this.addSpecialObj(GC.SCREEN.CENTER.X - 190 + (i * 190), GC.SCREEN.CENTER.Y - 22);
                this.m_specialObj = new Glass(4);
                this.addSpecialObj(GC.SCREEN.CENTER.X - 190 + (i * 190), GC.SCREEN.CENTER.Y + 135);
                this.m_specialObj = new Glass(3);
                this.addSpecialObj(GC.SCREEN.CENTER.X - 386.5, GC.SCREEN.CENTER.Y + 130 - (i * 70));
                this.m_specialObj = new Glass(3);
                this.addSpecialObj(GC.SCREEN.CENTER.X + 386.5, GC.SCREEN.CENTER.Y + 130 - (i * 70));
            }
            this.m_specialObj = new Glass(3);
            this.addSpecialObj(GC.SCREEN.CENTER.X - 386.5, GC.SCREEN.CENTER.Y + 274);
            this.m_specialObj = new Glass(3);
            this.addSpecialObj(GC.SCREEN.CENTER.X + 386.5, GC.SCREEN.CENTER.Y + 274);
            this.m_specialObj = new PowerUp();
            this.addSpecialObj(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y + 215);
        }

        else if(currentLevel == 3)
        {
            levelBackground = new cc.Sprite(res.gameScreen_bg_png_3);
            ///Hearts
            this.addInitialHeart(true, 1, GC.SCREEN.CENTER.X + 50, 470);
            this.addInitialHeart(true, 2, GC.SCREEN.CENTER.X + 250, 500);
            this.addInitialHeart(true, 2, GC.SCREEN.CENTER.X  - 250, 500);
            this.addInitialHeart(false, 1, GC.SCREEN.CENTER.X - 50, 480);

            ///With Custom Collisions
            for(var i = 0; i < 2; i++)
            {
                var orangeBox = new cc.Sprite("#gameScreen_lv3w1.png");
                orangeBox.setPosition(GC.SCREEN.CENTER.X - 250 + (i * 494), GC.SCREEN.CENTER.Y + 110);
                this.m_brickBatchNode.addChild(orangeBox);
            }

            for (var i = 0; i < 2; i++)
            {
                this.addCustomCollision("#collider_lv3_w1_horz1.png", GC.SCREEN.CENTER.X - 370 + (i * 238), GC.SCREEN.CENTER.Y + 230);
                this.addCustomCollision("#collider_lv3_w1_horz1.png", GC.SCREEN.CENTER.X - 370 + (i * 238), GC.SCREEN.CENTER.Y - 7);
                this.addCustomCollision("#collider_lv3_w1_vert.png", GC.SCREEN.CENTER.X - 386 + (i * 270), GC.SCREEN.CENTER.Y + 111.5);
                this.addCustomCollision("#collider_lv3_w1_horz2.png", GC.SCREEN.CENTER.X - 250.8, GC.SCREEN.CENTER.Y + 246 + (i * -270));
                this.addCustomCollision("#collider_lv3_w1_horz1.png", GC.SCREEN.CENTER.X + 126 + (i * 238), GC.SCREEN.CENTER.Y + 230);
                this.addCustomCollision("#collider_lv3_w1_horz1.png", GC.SCREEN.CENTER.X + 126 + (i * 238), GC.SCREEN.CENTER.Y - 7);
                this.addCustomCollision("#collider_lv3_w1_vert.png", GC.SCREEN.CENTER.X + 110 + (i * 270), GC.SCREEN.CENTER.Y + 111.5);
                this.addCustomCollision("#collider_lv3_w1_horz2.png", GC.SCREEN.CENTER.X + 245.3, GC.SCREEN.CENTER.Y + 246 + (i * -270));
            }

            ///Special Objs
            this.m_specialObj = new PowerUp();
            this.addSpecialObj(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y + 260);
            this.m_specialObj = new Trigger("LeftBox");
            this.m_specialObj.setScale(1, -1);
            this.addSpecialObj(GC.SCREEN.CENTER.X - 50, GC.SCREEN.CENTER.Y + 230);
            this.m_specialObj = new Trigger("RightBox");
            this.m_specialObj.setScale(1, -1);
            this.addSpecialObj(GC.SCREEN.CENTER.X + 50, GC.SCREEN.CENTER.Y + 230);

            for(var i = 0; i < 2; i++)
            {
                this.m_specialObj = new Glass(3);
                this.addSpecialObj(GC.SCREEN.CENTER.X - 50, GC.SCREEN.CENTER.Y + 180 - (i * 140));
                this.m_specialObj = new Glass(3);
                this.addSpecialObj(GC.SCREEN.CENTER.X + 45, GC.SCREEN.CENTER.Y + 180 - (i * 140));
            }
        }

        else if(currentLevel == 4)
        {
            levelBackground = new cc.Sprite(res.gameScreen_bg_png_6);

            ///Static Bricks
            for(var i = 0; i < 2; i++)
            {
                this.addBrick("#gameScreen_lv4w1.png", 245 + (i * 877), GC.SCREEN.CENTER.Y - 50);
                this.addBrick("#gameScreen_lv4w2.png", 531.5 + (i * 303.5), GC.SCREEN.CENTER.Y - 50);
            }

            ///Fans
            this.m_specialObj = new CeilingFan(17);
            this.addSpecialObj(380, GC.SCREEN.SIZE.HEIGHT - 120);
            var cable = new cc.Sprite("#gobj_cable.png");
            cable.setPosition(380, GC.SCREEN.SIZE.HEIGHT + 70);
            this.m_gobjBatchNode.addChild(cable);

            this.m_specialObj = new CeilingFan(22);
            this.addSpecialObj(985, GC.SCREEN.SIZE.HEIGHT - 120);
            var cable2 = new cc.Sprite("#gobj_cable.png");
            cable2.setPosition(985, GC.SCREEN.SIZE.HEIGHT + 70);
            this.m_gobjBatchNode.addChild(cable2);

            this.m_specialObj = new CeilingFan(8);
            this.addSpecialObj(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y + 70);
            var cable3 = new cc.Sprite("#gobj_cable.png");
            cable3.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.SIZE.HEIGHT - 125);
            this.m_gobjBatchNode.addChild(cable3);

            ///Special Obj
            for(var i = 0; i < 3; i++)
            {
                this.m_specialObj = new Glass(4);
                this.addSpecialObj(380 + (i * 303), GC.SCREEN.CENTER.Y - 50);
            }
            this.m_specialObj = new PowerUp();
            this.addSpecialObj(380, GC.SCREEN.CENTER.Y + 70);
            this.m_specialObj = new PowerUp();
            this.addSpecialObj(985, GC.SCREEN.CENTER.Y + 70);
        }

        else if(currentLevel == 5)
        {
            levelBackground = new cc.Sprite(res.gameScreen_bg_png_4);

            ///Hearts
            this.addInitialHeart(true, 2, 430, 550);
            this.addInitialHeart(false, 2, 930, 550);

            ///Bulbs
            var bulb = new cc.Sprite("#gobj_lightbulb.png");
            bulb.setPosition(240, GC.SCREEN.CENTER.Y + 110);
            this.m_gobjBatchNode.addChild(bulb);
            var cable = new cc.Sprite("#gobj_cable.png");
            cable.setPosition(240, GC.SCREEN.CENTER.Y + 298);
            this.m_gobjBatchNode.addChild(cable);
            this.m_specialObj = new SmileyBulb();
            this.m_specialObj.setPosition(240, GC.SCREEN.CENTER.Y + 110);
            this.m_gobjBatchNode.addChild(this.m_specialObj, 4);
            this.m_bricksContainer.push(this.m_specialObj);

            var bulb1 = new cc.Sprite("#gobj_lightbulb.png");
            bulb1.setPosition(GC.SCREEN.SIZE.WIDTH - 240, GC.SCREEN.CENTER.Y + 110);
            this.m_gobjBatchNode.addChild(bulb1);
            var cable1 = new cc.Sprite("#gobj_cable.png");
            cable1.setPosition(GC.SCREEN.SIZE.WIDTH - 240, GC.SCREEN.CENTER.Y + 298);
            this.m_gobjBatchNode.addChild(cable1);
            this.m_specialObj = new SmileyBulb();
            this.m_specialObj.setPosition(GC.SCREEN.SIZE.WIDTH - 240, GC.SCREEN.CENTER.Y + 110);
            this.m_gobjBatchNode.addChild(this.m_specialObj, 4);
            this.m_bricksContainer.push(this.m_specialObj);

            var bulb2 = new cc.Sprite("#gobj_lightbulb.png");
            bulb2.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.SIZE.HEIGHT - 70);
            this.m_gobjBatchNode.addChild(bulb2);
            var cable2 = new cc.Sprite("#gobj_cable.png");
            cable2.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.SIZE.HEIGHT + 118);
            this.m_gobjBatchNode.addChild(cable2);
            this.m_specialObj = new SmileyBulb();
            this.m_specialObj.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.SIZE.HEIGHT - 70);
            this.m_gobjBatchNode.addChild(this.m_specialObj, 4);
            this.m_bricksContainer.push(this.m_specialObj);

            for(var i = 0; i < 2; i++)
            {
                var bulb = new cc.Sprite("#gobj_lightbulb.png");
                bulb.setPosition(GC.SCREEN.CENTER.X - 223.5 + (i * 456), GC.SCREEN.SIZE.HEIGHT - 120);
                this.m_gobjBatchNode.addChild(bulb);

                var cable3 = new cc.Sprite("#gobj_cable.png");
                cable3.setPosition(GC.SCREEN.CENTER.X - 223.5 + (i * 456), GC.SCREEN.SIZE.HEIGHT + 68);
                this.m_gobjBatchNode.addChild(cable3);

                this.m_specialObj = new SmileyBulb();
                this.m_specialObj.setPosition(GC.SCREEN.CENTER.X - 223.5 + (i * 456), GC.SCREEN.SIZE.HEIGHT - 120);
                this.m_gobjBatchNode.addChild(this.m_specialObj, 4);
                this.m_bricksContainer.push(this.m_specialObj);
            }

            //Static Bricks
            for(var i = 0; i < 2; i++)
            {
                this.addBrick("#gameScreen_lv5w3.png", (GC.SCREEN.CENTER.X - 113) + (i * 225.5), GC.SCREEN.CENTER.Y + 80);
                this.addBrick("#gameScreen_lv5w2.png", (GC.SCREEN.CENTER.X - 319.5) + (i * 638.5), GC.SCREEN.CENTER.Y + 80);
            }

            for(var i = 0; i < 4; i++)
            {
                this.addBrick("#gameScreen_lv5w1.png", (GC.SCREEN.CENTER.X - 390) + (i * 260.5), GC.SCREEN.CENTER.Y - 80);
            }

            //Special Obj
            for(var i = 0; i < 3; i++)
            {
                this.m_specialObj = new Glass(2);
                this.addSpecialObj((GC.SCREEN.CENTER.X - 223.5) + (i * 223.5), GC.SCREEN.CENTER.Y + 80);
            }

            for(var i = 0;  i < 2; i++)
            {
                this.m_specialObj = new PowerUp();
                this.addSpecialObj((GC.SCREEN.CENTER.X - 223.5) + (i * 449), GC.SCREEN.CENTER.Y + 10);
            }
        }

        else if(currentLevel == 6)
        {
            levelBackground = new cc.Sprite(res.gameScreen_bg_png_1);

            ///Custom Collisions
            var leftTop = new cc.Sprite("#gameScreen_lv6w1.png");
            leftTop.setPosition(GC.SCREEN.CENTER.X - 113, GC.SCREEN.CENTER.Y + 163);
            this.m_brickBatchNode.addChild(leftTop);
            var rightTop = new cc.Sprite("#gameScreen_lv6w2.png");
            rightTop.setPosition(GC.SCREEN.CENTER.X + 113, GC.SCREEN.CENTER.Y + 163);
            this.m_brickBatchNode.addChild(rightTop);
            var leftBot = new cc.Sprite("#gameScreen_lv6w3.png");
            leftBot.setPosition(GC.SCREEN.CENTER.X - 113, GC.SCREEN.CENTER.Y - 48);
            this.m_brickBatchNode.addChild(leftBot);
            var rightBot = new cc.Sprite("#gameScreen_lv6w4.png");
            rightBot.setPosition(GC.SCREEN.CENTER.X + 113, GC.SCREEN.CENTER.Y- 48);
            this.m_brickBatchNode.addChild(rightBot);
            this.addCustomCollision("#collider_lv6_w1_horz.png", GC.SCREEN.CENTER.X - 113, GC.SCREEN.CENTER.Y + 195);
            this.addCustomCollision("#collider_lv6_w1_vert.png", GC.SCREEN.CENTER.X - 145, GC.SCREEN.CENTER.Y + 147);
            this.addCustomCollision("#collider_lv6_w1_horz.png", GC.SCREEN.CENTER.X + 113, GC.SCREEN.CENTER.Y + 195);
            this.addCustomCollision("#collider_lv6_w1_vert.png", GC.SCREEN.CENTER.X + 145, GC.SCREEN.CENTER.Y + 147);
            this.addCustomCollision("#collider_lv6_w1_horz.png", GC.SCREEN.CENTER.X - 113, GC.SCREEN.CENTER.Y - 79.5);
            this.addCustomCollision("#collider_lv6_w1_vert.png", GC.SCREEN.CENTER.X - 145, GC.SCREEN.CENTER.Y - 32);
            this.addCustomCollision("#collider_lv6_w1_horz.png", GC.SCREEN.CENTER.X + 113, GC.SCREEN.CENTER.Y - 79.5);
            this.addCustomCollision("#collider_lv6_w1_vert.png", GC.SCREEN.CENTER.X + 145, GC.SCREEN.CENTER.Y - 32);

            ///Static Bricks
            for (var i = 0; i < 2; i++)
            {
                this.addBrick("#gameScreen_pinkWall1.png", (GC.SCREEN.CENTER.X - 145) + (i * 290.5), GC.SCREEN.CENTER.Y + 99);
                this.addBrick("#gameScreen_pinkWall1.png", (GC.SCREEN.CENTER.X - 145) + (i * 290.5), GC.SCREEN.CENTER.Y + 15);
                this.addBrick("#gameScreen_pinkWall1.png", (GC.SCREEN.CENTER.X - 49) + (i * 99), GC.SCREEN.CENTER.Y + 195);
                this.addBrick("#gameScreen_pinkWall1.png", (GC.SCREEN.CENTER.X - 49) + (i * 99), GC.SCREEN.CENTER.Y - 80);
            }

            ///Special Objs
            for(var i = 0; i < 2; i++)
            {
                this.m_specialObj = new PowerUp();
                this.addSpecialObj(GC.SCREEN.CENTER.X - 300 + (i * 600), GC.SCREEN.CENTER.Y + 55);
            }

        }

        else if(currentLevel == 7)
        {
            levelBackground = new cc.Sprite(res.gameScreen_bg_png_2);

            //Custom Collisions
            var leftTop = new cc.Sprite("#gameScreen_lv7w1.png");
            leftTop.setPosition(300 , GC.SCREEN.CENTER.Y + 200);
            this.m_brickBatchNode.addChild(leftTop);
            var leftBot = new cc.Sprite("#gameScreen_lv7w2.png");
            leftBot.setPosition(300 , GC.SCREEN.CENTER.Y + 70);
            this.m_brickBatchNode.addChild(leftBot);
            var rightTop = new cc.Sprite("#gameScreen_lv7w3.png");
            rightTop.setPosition(GC.SCREEN.SIZE.WIDTH - 300, GC.SCREEN.CENTER.Y + 200);
            this.m_brickBatchNode.addChild(rightTop);
            var rightBot = new cc.Sprite("#gameScreen_lv7w4.png");
            rightBot.setPosition(GC.SCREEN.SIZE.WIDTH - 300, GC.SCREEN.CENTER.Y + 70);
            this.m_brickBatchNode.addChild(rightBot);
            var mid = new cc.Sprite("#gameScreen_lv7w5.png");
            mid.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y + 270);
            this.m_brickBatchNode.addChild(mid);
            this.addCustomCollision("#collider_lv7_w5_horz.png", GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y + 305);
            this.addCustomCollision("#collider_lv7_w1_horz.png", 300, GC.SCREEN.CENTER.Y + 218);
            this.addCustomCollision("#collider_lv7_w1_horz.png", 300, GC.SCREEN.CENTER.Y + 51);
            this.addCustomCollision("#collider_lv7_w1_vert.png", 157, GC.SCREEN.CENTER.Y + 84.5);
            this.addCustomCollision("#collider_lv7_w1_vert.png", 157, GC.SCREEN.CENTER.Y + 185);
            this.addCustomCollision("#collider_lv7_w1_horz.png", GC.SCREEN.SIZE.WIDTH - 300, GC.SCREEN.CENTER.Y + 218);
            this.addCustomCollision("#collider_lv7_w1_horz.png", GC.SCREEN.SIZE.WIDTH - 300, GC.SCREEN.CENTER.Y + 51);
            this.addCustomCollision("#collider_lv7_w1_vert.png", GC.SCREEN.SIZE.WIDTH - 157, GC.SCREEN.CENTER.Y + 84.5);
            this.addCustomCollision("#collider_lv7_w1_vert.png", GC.SCREEN.SIZE.WIDTH - 157, GC.SCREEN.CENTER.Y + 185);
            for(var i = 0; i < 2; i++)
            {
                this.addCustomCollision("#collider_lv7_w5_vert.png", (GC.SCREEN.CENTER.X - 88) + (i * 177), GC.SCREEN.CENTER.Y + 254);
            }

            //Static Bricks
            for(var i = 0; i < 2; i++)
            {
                this.addBrick("#gameScreen_pinkWallB1.png", 156, GC.SCREEN.CENTER.Y + 120 + (i * 30));
                this.addBrick("#gameScreen_pinkWallB1.png", GC.SCREEN.SIZE.WIDTH - 156, GC.SCREEN.CENTER.Y + 120 + (i * 30));
                this.addBrick("#gameScreen_pinkWallB1.png", (GC.SCREEN.CENTER.X - 88) + (i * 177), GC.SCREEN.CENTER.Y - 59);
                this.addBrick("#gameScreen_pinkWallB1.png", (GC.SCREEN.CENTER.X - 400) + (i * 60), GC.SCREEN.CENTER.Y - 60);
                this.addBrick("#gameScreen_pinkWallB1.png", (GC.SCREEN.CENTER.X + 400) + (i * 60), GC.SCREEN.CENTER.Y - 60);
            }

            for(var i = 0; i < 3; i++)
            {
                for(var j = 0; j < 2; j++)
                {
                    this.addBrick("#gameScreen_pinkWallB1.png", (GC.SCREEN.CENTER.X - 88) + (j * 177), GC.SCREEN.CENTER.Y + 112 + (i * 30));
                }
            }

            //Special Obj
            this.m_specialObj = new Glass(4);
            this.m_specialObj.setScale(1.2, 1);
            this.addSpecialObj(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y - 59);
            for(var i = 0; i < 2; i++)
            {
                this.m_specialObj = new Glass(4);
                this.m_specialObj.setScale(1.2, 1);
                this.addSpecialObj(GC.SCREEN.CENTER.X, (GC.SCREEN.CENTER.Y + 112) + (i * 30));
                this.m_specialObj = new PowerUp();
                this.addSpecialObj((GC.SCREEN.CENTER.X - 170) + (i * 335), GC.SCREEN.CENTER.Y + 132);
            }

            this.m_specialObj = new Trigger("OpenLeft");
            this.m_specialObj.setScale(-1);
            this.addSpecialObj(GC.SCREEN.CENTER.X - 370, GC.SCREEN.CENTER.Y - 74);
            this.m_specialObj = new Trigger("OpenMid");
            this.m_specialObj.setRotation(-90);
            this.m_specialObj.setScale(-1);
            this.addSpecialObj(GC.SCREEN.CENTER.X - 74, GC.SCREEN.CENTER.Y + 202);
            this.m_specialObj = new Trigger("OpenRight");
            this.m_specialObj.setScale(-1);
            this.addSpecialObj(GC.SCREEN.CENTER.X + 430, GC.SCREEN.CENTER.Y - 74);
            this.m_specialObj = new Trigger("OpenMid");
            this.m_specialObj.setRotation(90);
            this.m_specialObj.setScale(-1);
            this.addSpecialObj(GC.SCREEN.CENTER.X + 74, GC.SCREEN.CENTER.Y + 202);
            this.m_specialObj = new MetalDoor("Left");
            this.m_specialObj.setScale(1.2, 1);
            this.m_specialObj.setRotation(90);
            this.addSpecialObj(GC.SCREEN.CENTER.X - 240, GC.SCREEN.CENTER.Y + 135);
            this.m_metalDoorContainer.push(this.m_specialObj);
            this.m_specialObj = new MetalDoor("Right");
            this.m_specialObj.setScale(1.2, 1);
            this.m_specialObj.setRotation(90);
            this.addSpecialObj(GC.SCREEN.CENTER.X + 240, GC.SCREEN.CENTER.Y + 135);
            this.m_metalDoorContainer.push(this.m_specialObj);
            this.m_specialObj = new MetalDoor("Mid");
            this.m_specialObj.setScale(1.2, 1);
            this.m_specialObj.setRotation(90);
            this.addSpecialObj(GC.SCREEN.CENTER.X - 88, GC.SCREEN.CENTER.Y + 28);
            this.m_metalDoorContainer.push(this.m_specialObj);
            this.m_specialObj = new MetalDoor("Mid");
            this.m_specialObj.setScale(1.2, 1);
            this.m_specialObj.setRotation(90);
            this.addSpecialObj(GC.SCREEN.CENTER.X + 88, GC.SCREEN.CENTER.Y + 28);
            this.m_metalDoorContainer.push(this.m_specialObj);

        }

        else if(currentLevel == 8)
        {
            levelBackground = new cc.Sprite(res.gameScreen_bg_png_3);

            //Custom Collision
            var leftTop = new cc.Sprite("#gameScreen_lv8w1.png");
            leftTop.setPosition(300, GC.SCREEN.CENTER.Y + 215);
            this.m_brickBatchNode.addChild(leftTop);
            var leftTop2 = new cc.Sprite("#gameScreen_lv8w3.png");
            leftTop2.setPosition(GC.SCREEN.CENTER.X - 95, GC.SCREEN.CENTER.Y + 215);
            this.m_brickBatchNode.addChild(leftTop2);
            var leftBot = new cc.Sprite("#gameScreen_lv8w5.png");
            leftBot.setPosition(335, GC.SCREEN.CENTER.Y);
            this.m_brickBatchNode.addChild(leftBot);
            var leftBot2 = new cc.Sprite("#gameScreen_lv8w6.png");
            leftBot2.setPosition(503, GC.SCREEN.CENTER.Y);
            this.m_brickBatchNode.addChild(leftBot2);
            var rightTop = new cc.Sprite("#gameScreen_lv8w2.png");
            rightTop.setPosition(GC.SCREEN.SIZE.WIDTH - 300, GC.SCREEN.CENTER.Y + 215);
            this.m_brickBatchNode.addChild(rightTop);
            var rightTop2 = new cc.Sprite("#gameScreen_lv8w4.png");
            rightTop2.setPosition(GC.SCREEN.CENTER.X + 95, GC.SCREEN.CENTER.Y + 215);
            this.m_brickBatchNode.addChild(rightTop2);
            var rightBot = new cc.Sprite("#gameScreen_lv8w6.png");
            rightBot.setPosition(GC.SCREEN.SIZE.WIDTH - 335, GC.SCREEN.CENTER.Y);
            this.m_brickBatchNode.addChild(rightBot);
            var rightBot2 = new cc.Sprite("#gameScreen_lv8w5.png");
            rightBot2.setPosition(GC.SCREEN.CENTER.X + 180, GC.SCREEN.CENTER.Y);
            this.m_brickBatchNode.addChild(rightBot2);

            this.addCustomCollision("#collider_lv8_w1_horz.png", 300, GC.SCREEN.CENTER.Y + 250);
            this.addCustomCollision("#collider_lv8_w1_vert.png", 268, GC.SCREEN.CENTER.Y + 200);
            this.addCustomCollision("#collider_lv8_w1_horz.png", GC.SCREEN.SIZE.WIDTH - 300, GC.SCREEN.CENTER.Y + 250);
            this.addCustomCollision("#collider_lv8_w1_vert.png", GC.SCREEN.SIZE.WIDTH - 268, GC.SCREEN.CENTER.Y + 200);
            this.addCustomCollision("#collider_lv8_w5_horz.png", 335, GC.SCREEN.CENTER.Y - 32);
            this.addCustomCollision("#collider_lv8_w5_horz.png", 503, GC.SCREEN.CENTER.Y - 32);
            this.addCustomCollision("#collider_lv8_w5_horz.png", GC.SCREEN.CENTER.X + 180, GC.SCREEN.CENTER.Y - 32);
            this.addCustomCollision("#collider_lv8_w5_horz.png", GC.SCREEN.SIZE.WIDTH - 335, GC.SCREEN.CENTER.Y - 32);
            this.addCustomCollision("#collider_lv8_w5_vert.png", 267.5, GC.SCREEN.CENTER.Y + 15);
            this.addCustomCollision("#collider_lv8_w5_vert.png", 570, GC.SCREEN.CENTER.Y + 15);
            this.addCustomCollision("#collider_lv8_w5_vert.png", 795, GC.SCREEN.CENTER.Y + 15);
            this.addCustomCollision("#collider_lv8_w5_vert.png", GC.SCREEN.SIZE.WIDTH - 268, GC.SCREEN.CENTER.Y + 15);
            this.addCustomCollision("#collider_lv8_w3_horz.png", GC.SCREEN.CENTER.X - 95, GC.SCREEN.CENTER.Y + 250);
            this.addCustomCollision("#collider_lv8_w1_vert.png", GC.SCREEN.CENTER.X - 110, GC.SCREEN.CENTER.Y + 200);
            this.addCustomCollision("#collider_lv8_w3_horz.png", GC.SCREEN.CENTER.X + 95, GC.SCREEN.CENTER.Y + 250);
            this.addCustomCollision("#collider_lv8_w1_vert.png", GC.SCREEN.CENTER.X + 110, GC.SCREEN.CENTER.Y + 200);

            //Static Bricks
            this.addBrick("#gameScreen_lv8w7.png", GC.SCREEN.CENTER.X + 1, GC.SCREEN.CENTER.Y + 250);
            this.addBrick("#gameScreen_lv8w7.png", GC.SCREEN.CENTER.X + 159, GC.SCREEN.CENTER.Y + 249);
            this.addBrick("#gameScreen_lv8w7.png", GC.SCREEN.CENTER.X - 159, GC.SCREEN.CENTER.Y + 249);

            //Special Obj
            this.m_specialObj = new MetalDoor("Right");
            this.m_specialObj.setScale(1, 1.1);
            this.m_specialObj.setRotation(90);
            this.addSpecialObj(GC.SCREEN.CENTER.X - 112, GC.SCREEN.CENTER.Y + 105);
            this.m_metalDoorContainer.push(this.m_specialObj);
            this.m_specialObj = new MetalDoor("Right");
            this.m_specialObj.setScale(1, 1.1);
            this.m_specialObj.setRotation(90);
            this.addSpecialObj(267, GC.SCREEN.CENTER.Y + 105);
            this.m_metalDoorContainer.push(this.m_specialObj);
            this.m_specialObj = new MetalDoor("Right");
            this.addSpecialObj(GC.SCREEN.CENTER.X - 261, GC.SCREEN.CENTER.Y + 249);
            this.m_metalDoorContainer.push(this.m_specialObj);

            this.m_specialObj = new MetalDoor("Left");
            this.m_specialObj.setScale(1, 1.1);
            this.m_specialObj.setRotation(90);
            this.addSpecialObj(GC.SCREEN.SIZE.WIDTH - 268, GC.SCREEN.CENTER.Y + 105);
            this.m_metalDoorContainer.push(this.m_specialObj);
            this.m_specialObj = new MetalDoor("Left");
            this.m_specialObj.setScale(1, 1.1);
            this.m_specialObj.setRotation(90);
            this.addSpecialObj(GC.SCREEN.CENTER.X + 112, GC.SCREEN.CENTER.Y + 105);
            this.m_metalDoorContainer.push(this.m_specialObj);
            this.m_specialObj = new MetalDoor("Left");
            this.addSpecialObj(GC.SCREEN.CENTER.X + 261, GC.SCREEN.CENTER.Y + 249);
            this.m_metalDoorContainer.push(this.m_specialObj);

            this.m_specialObj = new Trigger("OpenRight");
            this.m_specialObj.setScale(-1);
            this.addSpecialObj(GC.SCREEN.CENTER.X - 47, GC.SCREEN.CENTER.Y + 235);
            this.m_specialObj = new Trigger("OpenLeft");
            this.m_specialObj.setScale(-1);
            this.addSpecialObj(GC.SCREEN.CENTER.X + 48, GC.SCREEN.CENTER.Y + 235);

            this.m_specialObj = new PowerUp();
            this.addSpecialObj(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y + 110);

            for(var i = 0; i < 2; i++)
            {
                for(var j = 0; j < 2; j++)
                {
                    this.m_specialObj = new Glass(3);
                    this.addSpecialObj(638 + (i * 93), (GC.SCREEN.CENTER.Y - 5) - (j * 30));
                }
            }
        }

        else if(currentLevel == 9)
        {
            levelBackground = new cc.Sprite(res.gameScreen_bg_png_5);

            //Custom Collision
            var roofTopLeft = new cc.Sprite("#gameScreen_lv9w1.png");
            roofTopLeft.setPosition(300, GC.SCREEN.CENTER.Y + 180);
            this.m_brickBatchNode.addChild(roofTopLeft);
            var roofTopRight = new cc.Sprite("#gameScreen_lv9w1.png");
            roofTopRight.setPosition(GC.SCREEN.SIZE.WIDTH - 300, GC.SCREEN.CENTER.Y + 180);
            this.m_brickBatchNode.addChild(roofTopRight);
            var roofTopMidLeft = new cc.Sprite("#gameScreen_lv9w2.png");
            roofTopMidLeft.setPosition(510, GC.SCREEN.CENTER.Y + 212);
            this.m_brickBatchNode.addChild(roofTopMidLeft);
            var roofTopMidRight = new cc.Sprite("#gameScreen_lv9w3.png");
            roofTopMidRight.setPosition(858.5, GC.SCREEN.CENTER.Y + 212);
            this.m_brickBatchNode.addChild(roofTopMidRight);

            this.addCustomCollision("#collider_lv9_w2_horz.png", 510, GC.SCREEN.CENTER.Y + 275);
            this.addCustomCollision("#collider_lv9_w2_vert.png", 446, GC.SCREEN.CENTER.Y + 195);
            this.addCustomCollision("#collider_lv9_w2_vert.png", 922.5, GC.SCREEN.CENTER.Y + 195);
            this.addCustomCollision("#collider_lv9_w2_horz.png", 858.5, GC.SCREEN.CENTER.Y + 275);
            this.addCustomCollision("#collider_lv9_w1_horz.png", 300, GC.SCREEN.CENTER.Y + 211);
            this.addCustomCollision("#collider_lv9_w1_vert.png", 220, GC.SCREEN.CENTER.Y + 164.5);
            this.addCustomCollision("#collider_lv9_w1_vert.png", 380, GC.SCREEN.CENTER.Y + 164.5);
            this.addCustomCollision("#collider_lv9_w1_horz.png", GC.SCREEN.SIZE.WIDTH - 300, GC.SCREEN.CENTER.Y + 211);
            this.addCustomCollision("#collider_lv9_w1_vert.png", GC.SCREEN.SIZE.WIDTH - 380, GC.SCREEN.CENTER.Y + 164.5);
            this.addCustomCollision("#collider_lv9_w1_vert.png", GC.SCREEN.SIZE.WIDTH - 220, GC.SCREEN.CENTER.Y + 164.5);

            //Static Bricks
            this.addBrick("#gameScreen_lv9w4.png", GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y + 276);
            this.addBrick("#gameScreen_lv9w5.png", 525, GC.SCREEN.CENTER.Y - 41.5);
            this.addBrick("#gameScreen_lv9w5.png", 842.5, GC.SCREEN.CENTER.Y - 41.5);
            for(var i = 0; i < 2; i++)
            {
                this.addBrick("#gameScreen_lv9w7.png", 220 + (i * 160), GC.SCREEN.CENTER.Y + 85);
                this.addBrick("#gameScreen_lv9w7.png", (GC.SCREEN.SIZE.WIDTH - 220) - (i * 160), GC.SCREEN.CENTER.Y + 85);
                this.addBrick("#gameScreen_lv9w6.png", 446.5 + (i * 155), GC.SCREEN.CENTER.Y + 36);
                this.addBrick("#gameScreen_lv9w6.png", 767 + (i * 155), GC.SCREEN.CENTER.Y + 36);
            }

            //Special Obj
            this.m_specialObj = new MetalDoor("MidLeft");
            this.m_specialObj.setScale(1.1, 1.1);
            this.m_specialObj.setRotation(90);
            this.addSpecialObj(GC.SCREEN.CENTER.X - 82, GC.SCREEN.CENTER.Y + 198);
            this.m_metalDoorContainer.push(this.m_specialObj);
            this.m_specialObj = new MetalDoor("MidRight");
            this.m_specialObj.setScale(1.1, 1.1);
            this.m_specialObj.setRotation(90);
            this.addSpecialObj(767, GC.SCREEN.CENTER.Y + 198);
            this.m_metalDoorContainer.push(this.m_specialObj);
            this.m_specialObj = new MetalDoor("Mid");
            this.m_specialObj.setScale(1.1, 1);
            this.addSpecialObj(GC.SCREEN.CENTER.X + 1.5, GC.SCREEN.CENTER.Y + 116);
            this.m_metalDoorContainer.push(this.m_specialObj);

            this.m_specialObj = new MetalDoor("Right");
            this.addSpecialObj(300, GC.SCREEN.CENTER.Y + 54);
            this.m_metalDoorContainer.push(this.m_specialObj);
            this.m_specialObj = new MetalDoor("Right");
            this.addSpecialObj(GC.SCREEN.SIZE.WIDTH - 300, GC.SCREEN.CENTER.Y + 54);
            this.m_metalDoorContainer.push(this.m_specialObj);

            this.m_specialObj = new Trigger("OpenMidLeft");
            this.m_specialObj.setScale(-1);
            this.addSpecialObj(478, GC.SCREEN.CENTER.Y - 56);
            this.m_specialObj = new Trigger("OpenMid");
            this.m_specialObj.setScale(-1);
            this.addSpecialObj(571, GC.SCREEN.CENTER.Y - 56);
            this.m_specialObj = new Trigger("OpenMidRight");
            this.m_specialObj.setScale(-1);
            this.addSpecialObj(798, GC.SCREEN.CENTER.Y - 56);
            this.m_specialObj = new Trigger("OpenRight");
            this.m_specialObj.setScale(-1);
            this.addSpecialObj(890, GC.SCREEN.CENTER.Y - 56);

            this.m_specialObj = new PowerUp();
            this.addSpecialObj(300, GC.SCREEN.CENTER.Y - 50);
            this.m_specialObj = new PowerUp();
            this.addSpecialObj(GC.SCREEN.SIZE.WIDTH - 300, GC.SCREEN.CENTER.Y - 50);
        }

        else if(currentLevel == 10)
        {
            levelBackground = new cc.Sprite(res.gameScreen_bg_png_7);
            
            //Static Bricks
            for(var i = 0; i < 2; i++)
            {
                for(var j = 0; j < 3; j++)
                {
                    this.addBrick("#gameScreen_orangeWall1.png", 250 + (i * 190), GC.SCREEN.CENTER.Y + 230 - (j * 120));
                    this.addBrick("#gameScreen_orangeWall1.png", (GC.SCREEN.SIZE.WIDTH - 250) - (i * 190), GC.SCREEN.CENTER.Y + 230 - (j * 120));
                }
            }

            for(var i = 0; i < 2; i++)
            {
                for(var j = 0; j < 2; j++)
                {
                    this.addBrick("#gameScreen_orangeWall1.png", 350 + (i * 190), GC.SCREEN.CENTER.Y + 170 - (j * 120));
                    this.addBrick("#gameScreen_orangeWall1.png", (GC.SCREEN.SIZE.WIDTH - 350) - (i * 190), GC.SCREEN.CENTER.Y + 170 - (j * 120));
                }
            }

            for(var i = 0; i < 4; i++)
            {
                this.addBrick("#gameScreen_orangeWall1.png", GC.SCREEN.CENTER.X - 48, GC.SCREEN.CENTER.Y + 80 - (i * 30));
                this.addBrick("#gameScreen_orangeWall1.png", GC.SCREEN.CENTER.X + 48, GC.SCREEN.CENTER.Y + 80 - (i * 30));
            }

            for(var i = 0; i < 2; i++)
            {
                this.addBrick("#gameScreen_lv10w1.png", GC.SCREEN.CENTER.X - 48 + (i * 96), GC.SCREEN.CENTER.Y + 175);
            }

            //Special Obj
            for(var i = 0; i < 4; i++)
            {
                this.m_specialObj = new Glass(2);
                this.addSpecialObj(GC.SCREEN.CENTER.X, (GC.SCREEN.CENTER.Y - 9) + (i * 30));
            }

            this.m_specialObj = new PowerUp();
            this.addSpecialObj(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y + 128.5);
        }


        levelBackground.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y);
        this.addChild(levelBackground);
    },

    addPlayerWeapon:function()
    {
        if(GC.CURRENT_CHARACTER == GC.CHARACTER_NAME.BEAST)
        {
            this.m_maxIndexPool = 10;
            for(var i = 0; i < this.m_maxIndexPool; i++)
            {
                this.m_weapon = new Projectile("BeastBoy");
                this.m_fxBatchNode.addChild(this.m_weapon);
                this.m_weaponPool.push(this.m_weapon);
                //cc.log(this.m_weaponPool.length);
            }
        }

        else if(GC.CURRENT_CHARACTER == GC.CHARACTER_NAME.CYBORG)
        {
            this.m_maxIndexPool = 13;
            for(var i = 0; i < this.m_maxIndexPool; i++)
            {
                this.m_weapon = new Projectile("Cyborg");
                this.m_fxBatchNode.addChild(this.m_weapon);
                this.m_weaponPool.push(this.m_weapon);
                //cc.log(this.m_weaponPool.length);
            }
        }
    },

    reuseWeaponFromPool:function()
    {
        if(GC.CURRENT_CHARACTER == GC.CHARACTER_NAME.BEAST)
        {
            if(this.m_weaponIndexPool < 10)
            {
                this.m_weaponPool[this.m_weaponIndexPool].reuse(this.m_player.x + this.m_player.m_sourcePosProjectile.x, this.m_player.y + this.m_player.m_sourcePosProjectile.y, 0, 10, 0);
                this.m_weaponIndexPool += 1;
            }

            else 
            {
                this.m_weaponIndexPool = 0;
                this.m_weaponPool[this.m_weaponIndexPool].reuse(this.m_player.x + this.m_player.m_sourcePosProjectile.x, this.m_player.y + this.m_player.m_sourcePosProjectile.y, 0, 10, 0);
                this.m_weaponIndexPool += 1;
            }
        }

        else if(GC.CURRENT_CHARACTER == GC.CHARACTER_NAME.CYBORG)
        {
            if(this.m_weaponIndexPool < 10)
            {
                for(var i = 0; i < 3; i++)
                {
                    if(i == 2)
                        this.m_weaponPool[this.m_weaponIndexPool].reuse(this.m_player.x + this.m_player.m_sourcePosProjectile.x, this.m_player.y + this.m_player.m_sourcePosProjectile.y, 3, 10, 10);
                    else if(i == 1)
                        this.m_weaponPool[this.m_weaponIndexPool].reuse(this.m_player.x + this.m_player.m_sourcePosProjectile.x, this.m_player.y + this.m_player.m_sourcePosProjectile.y, 0, 10, 0);
                    else
                        this.m_weaponPool[this.m_weaponIndexPool].reuse(this.m_player.x + this.m_player.m_sourcePosProjectile.x, this.m_player.y + this.m_player.m_sourcePosProjectile.y, -3, 10, -10);

                        this.m_weaponIndexPool += 1;
                }
            }

            else 
            {
                this.m_weaponIndexPool = 0;
                for(var i = 0; i < 3; i++)
                {
                    if(i == 2)
                        this.m_weaponPool[this.m_weaponIndexPool].reuse(this.m_player.x + this.m_player.m_sourcePosProjectile.x, this.m_player.y + this.m_player.m_sourcePosProjectile.y, 3, 10, 10);
                    else if(i == 1)
                        this.m_weaponPool[this.m_weaponIndexPool].reuse(this.m_player.x + this.m_player.m_sourcePosProjectile.x, this.m_player.y + this.m_player.m_sourcePosProjectile.y, 0, 10, 0);
                    else
                        this.m_weaponPool[this.m_weaponIndexPool].reuse(this.m_player.x + this.m_player.m_sourcePosProjectile.x, this.m_player.y + this.m_player.m_sourcePosProjectile.y, -3, 10, -10);

                        this.m_weaponIndexPool += 1;
                }
            }
        }

    },

    multiplyHeart:function(p_size, p_posX, p_posY)
    {
        var posX = p_posX;
        var posY = p_posY;
        if(p_size == 1)
        {

            this.m_heart = new Heart(false, p_size);
            this.m_heart.setPosition(posX, posY);
            this.m_gobjBatchNode.addChild(this.m_heart, 3);
            this.m_heartContainer.push(this.m_heart);
            this.m_heart.startSimulation();

            this.m_heart = new Heart(true, p_size);
            this.m_heart.setPosition(posX, posY);
            this.m_gobjBatchNode.addChild(this.m_heart, 3);
            this.m_heartContainer.push(this.m_heart);
            this.m_heart.startSimulation();
            
        }

        else if(p_size == 0)
        {
            this.m_heart = new Heart(false, p_size);
            this.m_heart.setPosition(posX, posY);
            this.m_gobjBatchNode.addChild(this.m_heart, 3);
            this.m_heartContainer.push(this.m_heart);
            this.m_heart.startSimulation();

            this.m_heart = new Heart(true, p_size);
            this.m_heart.setPosition(posX, posY);
            this.m_gobjBatchNode.addChild(this.m_heart, 3);
            this.m_heartContainer.push(this.m_heart);
            this.m_heart.startSimulation();
        }
    },

    spawnPickUp:function(p_posX, p_posY)
    {
        var posX = p_posX;
        var posY = p_posY;
        var randNum = Tools.random(0, 3);
        var type;

        switch (randNum)
        {
            case 3: type = "ForceField";
                break;
            case 2: type = "Star";
                break;
            case 1: type = "Snow";
                break;
            case 0: type = "BrokenHeart";
                break;
        };

        this.m_pickUp = new PickUp(type);
        this.m_pickUp.setPosition(posX, posY);
        this.m_gobjBatchNode.addChild(this.m_pickUp, 5);
        this.m_pickUpContainer.push(this.m_pickUp);
    },

    spawnHeartFX:function(p_size, x, y)
    {
        this.m_heartFX = new HeartFX(p_size);
        this.m_heartFX.setPosition(x, y);
        this.m_gobjBatchNode.addChild(this.m_heartFX);
    },

    //Star Pickup Effect
    addAdditionalTime:function()
    {
        g_sharedHUDLyr.m_curTime += 15;
    },

    //Freeze Pickup Effect
    freezeHearts:function()
    {
        for(var i = 0; i < this.m_heartContainer.length; i++)
        {
            var heartObj = this.m_heartContainer[i];

            heartObj.freeze();
        }
    },

    //Add force field object (Calls from init then hide opacity) 
    initializeForceFieldFX:function()
    {
        this.m_forceFieldFX = new cc.Sprite("#fx_forcefield_0.png");
        this.m_forceFieldFX.setPosition(this.m_player.x, this.m_player.y);
        this.m_forceFieldFX.setOpacity(0);
        this.addChild(this.m_forceFieldFX);

        this.act_ForceFieldExplode = new Tools.createFramesAnimation("fx_forcefield_", 0.03, 1, 4);
    },

    //Force Field Pickup Effect
    activateForceField:function()
    {
        if(!this.m_isForceFieldActive && !this.m_isPlayerDead && !this.m_isInvincible)
        {
            Tools.changeSprite(this.m_forceFieldFX, "fx_forcefield_0.png");
            this.m_forceFieldFX.setScale(1);
            this.m_forceFieldFX.setOpacity(0);
            this.m_isForceFieldActive = true;
            this.m_isInvincible = true;
            this.m_forceFieldFX.runAction(cc.fadeIn(0.2));
        }
    },

    //Timed invincible effect after hit with force field buff
    delayInvincibility:function()
    {
        this.m_forceFieldFX.runAction(cc.sequence(this.act_ForceFieldExplode));
        this.m_forceFieldFX.runAction(cc.sequence(cc.delayTime(0.1),
            cc.fadeOut(0.2)));

        this.runAction(cc.sequence(cc.delayTime(2),
            cc.callFunc(function()
            {
                this.m_isInvincible = false;
            }, this)));

        this.m_player.m_upper.runAction(cc.sequence(cc.fadeOut(0.1),
            cc.fadeIn(0.1),
            cc.fadeOut(0.1),
            cc.fadeIn(0.1),
            cc.fadeOut(0.1),
            cc.fadeIn(0.1),
            cc.fadeOut(0.1),
            cc.fadeIn(0.1)));
    },

    //Broken Heart Pickup Effect
    destroyAllHeartsOnGame:function()
    {
        for(var i = 0; i < this.m_heartContainer.length; i++)
        {
            var heartObj = this.m_heartContainer[i];

            heartObj.destroy();
        }

        this.m_cameraShakeTimer = 0.1;
    },

    //Camera Shake Base Formula
    cameraShake:function()
    {   
        var randX = Tools.random(-1, 1);
        var randY = Tools.random(-1, 1);

        this.m_isCameraShaking = true;
        this.setPosition(this.x += randX, this.y += randY);
    },

    //Defines which door will trigger. Sends behaviour to the target.
    processMetalDoor:function(p_tag)
    {
        var tag = p_tag; 

        if(this.m_metalDoorContainer.length > 0)
        {
            for(var i = 0; i < this.m_metalDoorContainer.length; i++)
            {
                var doorObj = this.m_metalDoorContainer[i];

                if(p_tag != null)
                {
                    if(p_tag == "OpenLeft")
                    {
                        if(doorObj.m_tag == "Left")
                        {
                            doorObj.openDoor();
                        }
                    }

                    else if(p_tag == "OpenRight")
                    {
                        if(doorObj.m_tag == "Right")
                        {
                            doorObj.openDoor();
                        }
                    }

                    else if(p_tag == "OpenMid")
                    {
                        if(doorObj.m_tag == "Mid")
                        {
                            doorObj.openDoor();
                        }
                    }

                    else if(p_tag == "OpenMidLeft")
                    {
                        if(doorObj.m_tag == "MidLeft")
                        {
                            doorObj.openDoor();
                        }
                    }

                    else if(p_tag == "OpenMidRight")
                    {
                        if(doorObj.m_tag == "MidRight")
                        {
                            doorObj.openDoor();
                        }
                    }
                }
            }
        }
    },

    applyDamage:function()
    {
        if(!this.m_isPlayerDead && !this.m_isForceFieldActive && !this.m_isInvincible)
        {
            this.gameOver();
        }

        else if(!this.m_isPlayerDead && this.m_isForceFieldActive)
        {
            this.m_isForceFieldActive = false;
            this.delayInvincibility();
        }
    },

    gameOver:function()
    {
        this.m_isPlayerDead = true;
        this.m_isStartGame = false;
        this.m_player.playHit();
        this.m_player.unscheduleUpdate();
        this.unscheduleUpdate();
        cc.log(this.m_isPlayerDead);

        this.runAction(cc.sequence(cc.delayTime(0.5),
            cc.callFunc(function()
            {
                if(this.m_heartContainer.length > 0)
                {
                    for(var i = 0; i < this.m_heartContainer.length; i++)
                    {
                        var heartObj = this.m_heartContainer[i];
                        heartObj.unscheduleUpdate();
                        heartObj.cleanup();
                    }
                }

            }, this),
            cc.delayTime(0.3),
            cc.callFunc(function()
                {
                    g_sharedGameplayLyr = null;
                    this.cleanup();
                    cc.eventManager.removeListener(GestureListener, this);
                    var gameOverScene = new GameOverLayer();
                    cc.director.runScene(new cc.TransitionFade(.25, gameOverScene));

                }, this)));
    },

    collide:function(a, b)
    {
        var ax = a.x, ay = a.y, bx = b.x, by = b.y;
        var aRect = a.collideRect(ax, ay);
        var bRect = b.collideRect(bx, by);

        return cc.rectIntersectsRect(aRect, bRect);
    },

    update:function(dt)
    {
       
        /// COLLISION

        //Collision Pickup -> Player
        for(var i = 0; i < this.m_pickUpContainer.length; i++)
        {
            var pickUpObj = this.m_pickUpContainer[i];

            if(this.collide(pickUpObj, this.m_player))
            {
                pickUpObj.applyEffect();
                this.m_toDeletePickUp.push(pickUpObj);
            }
        }

        //Collision Weapon -> Bricks
        for(var i = 0; i < this.m_weaponPool.length; i++)
        {
            var weaponObj = this.m_weaponPool[i];
            for(var j = 0; j < this.m_bricksContainer.length; j++)
            {
                var brickObj = this.m_bricksContainer[j];

                if(this.collide(weaponObj, brickObj))
                {
                    weaponObj.playCollideAnimation();
                    if(brickObj.m_type == "Special")
                    brickObj.playFXAnim();
                }

            }
        }

        for(var i = 0; i < this.m_heartContainer.length; i++)
        {
            var heartObj = this.m_heartContainer[i];

            for(var j = 0; j < this.m_weaponPool.length; j++)
            {
                var weaponObj = this.m_weaponPool[j];

                //Collision heart -> player weapon
                if(this.collide(heartObj, weaponObj))
                {
                    weaponObj.playCollideAnimation();
                    heartObj.destroy();
                }

            }

            //Collision heart -> player
            if(this.collide(heartObj, this.m_player))
            {
                this.applyDamage();
            }
           

        }

        for(var i = 0; i <this.m_heartContainer.length; i++)
        {
            var heartObj = this.m_heartContainer[i];

            for(var j = 0; j < this.m_bricksContainer.length; j++)
            {
                var brickObj = this.m_bricksContainer[j];

                //Collision heart -> Bricks (Contains bounce formula)
                if(this.collide(heartObj, brickObj))
                {
                    
                    var heartObjBottom = (heartObj.y - (heartObj.height / 2)) + heartObj.height;
                    var brickObjBottom = (brickObj.y - (brickObj.height / 2)) + brickObj.height;
                    var heartObjRight = (heartObj.x - (heartObj.width / 2))  + heartObj.width;
                    var brickObjRight = (brickObj.x - (brickObj.width / 2))  + brickObj.width;
                    

                    var b_collision = brickObjBottom - (heartObj.y - (heartObj.height / 2));
                    var t_collision = heartObjBottom - (brickObj.y - (brickObj.height / 2));
                    var l_collision = heartObjRight - (brickObj.x - (brickObj.width / 2));
                    var r_collision = brickObjRight - (heartObj.x - (heartObj.width / 2));
                    
                    var timeX = Math.abs(heartObj.m_velocity.x);
                    var timeY = Math.abs(heartObj.m_velocity.y);
                    if(timeY > timeX)
                    { 
                        if (t_collision < b_collision && t_collision < l_collision && t_collision < r_collision )
                        {
                            heartObj.collideObstacle("Bot");                           
                        //Bot collision
                        }
                        else if (b_collision < t_collision && b_collision < l_collision && b_collision < r_collision)                        
                        {
                            heartObj.collideObstacle("Top");
                        //Top collision
                        }

                        else if (l_collision < r_collision && l_collision < t_collision && l_collision < b_collision)
                        {
                            heartObj.collideObstacle("Left");
                        //Left collision
                        }
                        else if (r_collision < l_collision && r_collision < t_collision && r_collision < b_collision )
                        {
                            heartObj.collideObstacle("Right");
                        //Right collision
                        }
                    }

                    else if(timeX > timeY)
                    {
                        if (t_collision < b_collision && t_collision < l_collision && t_collision < r_collision )
                        {
                            heartObj.collideObstacle("Bot");                           
                        //Bot collision
                        }
                        else if (b_collision < t_collision && b_collision < l_collision && b_collision < r_collision)                        
                        {
                            heartObj.collideObstacle("Top");
                        //Top collision
                        }
                    
                        else if (l_collision < r_collision && l_collision < t_collision && l_collision < b_collision)
                        {
                            heartObj.collideObstacle("Left");
                        //Left collision
                        }
                        else if (r_collision < l_collision && r_collision < t_collision && r_collision < b_collision )
                        {
                            heartObj.collideObstacle("Right");
                        //Right collision
                        }
                    }

                    else cc.log("Diagonal");

                    //If heart collides with "Smiley" special Obj
                    if(brickObj.m_type == "Smiley")
                    brickObj.awake();
                    
                }
            }
        }

        // Collision (Rainbow -> Player) "Exclusive for some levels"
        if(GC.LEVEL == 4)
        {
            if(this.m_rainbowProj.length > 0)
            {
                for(var i = 0; i < this.m_rainbowProj.length; i++)
                {
                    var rainbowObj = this.m_rainbowProj[i];

                    if(this.collide(rainbowObj, this.m_player))
                    {
                        this.applyDamage();
                    }
                }
            }
        }
        /// - End COLLISION

        /// ARRAY GARBAGE
        if(this.m_toDelete.length > 0)
        {
            for (var i = 0; i < this.m_toDelete.length; i++)
            {
                this.m_heartContainer.splice(this.m_heartContainer.indexOf(this.m_toDelete[i]), 1);
            }

            this.m_toDelete = [];
        }

        if(this.m_toDeletePickUp.length > 0)
        {
            for(var i = 0; i < this.m_toDeletePickUp.length; i++)
            {
                this.m_pickUpContainer.splice(this.m_pickUpContainer.indexOf(this.m_toDeletePickUp[i]), 1);
                this.m_toDeletePickUp[i].removeFromParent();
            }

            this.m_toDeletePickUp = [];
        }

        /// - End ARRAY GARBAGE

        /// HANDLER 
        //Force Field Handler
        if(this.m_isForceFieldActive && this.m_player != null)
        {
            this.m_forceFieldFX.setPosition(this.m_player.x, this.m_player.y);
        }

        //Camera Shake Handler
        if(this.m_cameraShakeTimer > 0)
        {
            this.m_cameraShakeTimer -= dt;
            this.cameraShake();
        }

        else if(this.m_cameraShakeTimer < 1 && this.m_isCameraShaking)
        {
            this.m_isCameraShaking = false;
            this.setPosition(0, 0);
        }
        /// - End HANDLER

        //Hud Timer Tick
        g_sharedHUDLyr.m_curTime = cc.clampf(g_sharedHUDLyr.m_curTime, 0, 50);
        if(this.m_isStartGame)
        {
            if(g_sharedHUDLyr.m_curTime > 0)
            {
                g_sharedHUDLyr.m_curTime -= dt;
                g_sharedHUDLyr.m_timerBarFill.setPercentage(g_sharedHUDLyr.m_curTime * 2)
            }

            else
            {
                cc.log("GameOver");
                g_sharedHUDLyr.m_timerBarFill.setPercentage(0);
            }
        }
    }

});

// HUD stuff here

var g_sharedHUDLyr;

var HudLayer = cc.Layer.extend({

    m_timeBarPanel:undefined,
    m_timeBarSprite:undefined,
    m_timerBarFill:undefined,
    m_extraMenu:undefined,
    m_levelPanel:undefined,

    m_fireButton:undefined,
    m_levelSelectButton:undefined,
    m_levelText:undefined,

    m_curTime:undefined,
    m_startTime:undefined,

    m_uiBatchNode:undefined,

    ctor:function() 
    {
        this._super();
        this.loadBatchNodes();
        this.init();
    },

    loadBatchNodes:function() 
    {   
        cc.spriteFrameCache.addSpriteFrames(res.ui_plist);
        this.m_uiBatchNode = new cc.SpriteBatchNode(res.ui_png);
        this.addChild(this.m_uiBatchNode);
    },

    init:function()
    {
        //Initialize here
        g_sharedHUDLyr = this;

        this.m_timeBarPanel = new cc.Sprite("#ui_bar.png");
        this.m_timeBarPanel.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.SIZE.HEIGHT + 30);
        this.m_uiBatchNode.addChild(this.m_timeBarPanel);

        this.m_timeBarSprite = new cc.Sprite("#ui_bar_Fill.png");
        this.m_timerBarFill = new cc.ProgressTimer(this.m_timeBarSprite);
        this.m_timerBarFill.setType(cc.ProgressTimer.TYPE_BAR);
        this.m_timerBarFill.setMidpoint(cc.p(0, this.m_timerBarFill.height));
        this.m_timerBarFill.setPercentage(100);
        this.m_timerBarFill.setBarChangeRate(cc.p(1, 0));
        this.m_timerBarFill.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.SIZE.HEIGHT + 30);
        this.addChild(this.m_timerBarFill, 1);

        this.m_levelText = new cc.LabelBMFont("2", res.level1_fnt);
        this.m_levelText.setPosition(GC.SCREEN.CENTER.X - 310, GC.SCREEN.SIZE.HEIGHT - 23);
        this.m_levelText.setScale(0);
        this.addChild(this.m_levelText, 5);
        this.defineCurrentLevelText();

        this.m_levelSelectButton = new cc.MenuItemImage(
            "#ui_btn_lvlSelect.png",
            "#ui_btn_lvlSelect_D.png",
            this.switchLevelSelect,
            this);
        this.m_levelSelectButton.y = 70;

        this.m_fireButton = new cc.MenuItemImage(
            "#ui_btn_Shoot.png",
            "#ui_btn_Shoot_D.png",
            this.callFire,
            this);

        this.m_fireButton.x = 800;
        this.m_fireButton.y = -560;
        this.m_fireButton.setOpacity(0);

        this.m_extraMenu = new cc.Menu(this.m_levelSelectButton, this.m_fireButton);
        this.m_extraMenu.setPosition(GC.SCREEN.CENTER.X - 370, GC.SCREEN.SIZE.HEIGHT - 40);
        this.addChild(this.m_extraMenu);
        this.m_levelPanel = new cc.Sprite("#ui_level.png");
        this.m_levelPanel.setPosition(GC.SCREEN.CENTER.X - 310, GC.SCREEN.SIZE.HEIGHT + 30);
        this.m_uiBatchNode.addChild(this.m_levelPanel);

        this.runAction(cc.sequence(cc.delayTime(2),
            cc.callFunc(function()
            {
                this.revealHUD();
            }, this)));

        //Timer value
        this.m_startTime = 50;
        this.m_curTime = this.m_startTime;

    },

    revealHUD:function()
    {
        this.m_timeBarPanel.runAction(cc.moveTo(0.3, GC.SCREEN.CENTER.X, GC.SCREEN.SIZE.HEIGHT - 40));
        this.m_timerBarFill.runAction(cc.moveTo(0.3, GC.SCREEN.CENTER.X, GC.SCREEN.SIZE.HEIGHT - 40));

        this.m_fireButton.runAction(cc.fadeIn(0.2));
        this.m_levelPanel.runAction(cc.moveTo(0.3, GC.SCREEN.CENTER.X - 310, GC.SCREEN.SIZE.HEIGHT - 40));
        this.m_levelSelectButton.runAction(cc.moveTo(0.3, this.m_levelSelectButton.x, this.m_levelSelectButton.y - 70));

        this.m_levelText.runAction(cc.sequence(cc.delayTime(0.3), cc.scaleTo(0.1, 1), cc.scaleTo(0.1, 0.8)));
    },

    defineCurrentLevelText:function()
    {
        var currentLevel = GC.LEVEL;

        this.m_levelText.setString(currentLevel);
    },

    switchLevelSelect:function()
    {
        cc.log("Level Select");
    },

    //Calls every shoot HUD input
    callFire:function()
    {
        if(g_sharedGameplayLyr.m_isStartGame)
        g_sharedGameplayLyr.m_player.playShoot();
    }
});

var GameControlsLayer = cc.Layer.extend({
    ctor:function() 
    {
        this._super();
        this.init();
    },
    init:function()
    {
        //Initialize here
        
        // Keyboard listener
        if (cc.sys.capabilities.hasOwnProperty('keyboard')){
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased: KeyListener.onKeyReleased
            }, this);
        }
        
        // Touch listener
        //NOTE: Default swipe listener is attach, change this depending on what game control you need
        //      Check Control Events for more control inputs
        cc.eventManager.addListener(GestureListener, this);
        
    }
});

var GameplayScene = cc.Scene.extend({
    gameplayLayer:null,
    ctor:function() 
    {
        this._super();
    },
    
    onEnter:function () 
    {
        this._super();
        
        var gl = this.gameplayLayer = new GameplayLayer();
        var hl = new HudLayer();
        var gcl = new GameControlsLayer();
        this.addChild(gl);
        this.addChild(hl);
        this.addChild(gcl);
        
        //Centralize update
        //this.schedule(this.update);
    },
    
    update:function(delta)
    {
        this.gameLayer.update(delta);
    }
});


