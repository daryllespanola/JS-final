var g_sharedLevelSelLyr;

var LevelSelectLayer = cc.Layer.extend({
	
	m_charSelectCounter:undefined,

	m_charNamePanel:undefined,
	m_charSelectRav:undefined,
	m_charSelectCyb:undefined,
	m_charSelectBB:undefined,

	m_charSelectRavLayer:undefined,
	m_CharSelectCybLayer:undefined,
	m_charSelectBBLayer:undefined,
	m_canSelectChar:undefined,

	//Level Field
	m_charUnknownField:undefined,
	m_charUnknownFieldContainer:undefined,

	m_uiBatchNode:undefined,
	m_once:undefined,


	ctor:function()
	{
		this._super();
		this.loadBatch();
		this.init();
	},

	loadBatch:function()
	{
		this.m_uiBatchNode = new cc.SpriteBatchNode(res.ui_png);
        this.addChild(this.m_uiBatchNode, 5);
	},

	init:function()
	{
		g_sharedLevelSelLyr = this;
		this.m_once = false;
		this.m_charSelectCounter = 1;
		this.m_canSelectChar = true;

		//BG
		var bg = new cc.Sprite(res.levelSelect_bg_png);
		bg.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y);
		this.addChild(bg, 0);

		var topBG = new cc.Sprite(res.levelSelect_top_png);
		topBG.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.SIZE.HEIGHT - 60);
		this.addChild(topBG, 1);

		var bgPanel = new cc.Sprite(res.levelSelect_panel_png);
		bgPanel.setPosition(GC.SCREEN.CENTER.X, 198);
		this.addChild(bgPanel, 4);

		this.m_charSelectBB = new cc.Sprite("#lvlSel_char_beastBoy.png");
		this.m_charSelectBB.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y + 70);
		this.addChild(this.m_charSelectBB, 3);
		this.m_charSelectCyb = new cc.Sprite("#lvlSel_char_cyborg.png");
		this.m_charSelectCyb.setColor(cc.color(100, 100, 100, 100));
		this.m_charSelectCyb.setPosition(GC.SCREEN.CENTER.X - 200, GC.SCREEN.CENTER.Y - 30);
		this.addChild(this.m_charSelectCyb, 2);
		this.m_charSelectRav = new cc.Sprite("#lvlSel_char_raven.png");
		this.m_charSelectRav.setColor(cc.color(100, 100, 100, 100));
		this.m_charSelectRav.setPosition(GC.SCREEN.CENTER.X + 150, GC.SCREEN.CENTER.Y - 30);
		this.addChild(this.m_charSelectRav, 2);
		
		//Character Name Panel
		this.m_charNamePanel = new cc.Sprite("#ui_charSel_beastBoy.png");
		this.m_charNamePanel.setPosition(140, GC.SCREEN.CENTER.Y + 80);
		this.m_uiBatchNode.addChild(this.m_charNamePanel, 4);	

		//Character Select
		var navleft = new cc.MenuItemImage(
			"#ui_btn_levelSelect_prev_U.png",
			"#ui_btn_levelSelect_prev.png",
			this.goToPrevChar,
			this);

		navleft.anchorX = 1;
		navleft.anchorY = 1;
		navleft.x = -350;
		navleft.y = 100;

		var navRight = new cc.MenuItemImage(
			"#ui_btn_levelSelect_next_U.png",
			"#ui_btn_levelSelect_next.png",
			this.goToNextChar,
			this);

		navRight.anchorX = 1;
		navRight.anchorY = 1;
		navRight.x = 350;
		navRight.y = 100;

		var navCharMenu = new cc.Menu(navleft, navRight);
		navCharMenu.x = GC.SCREEN.CENTER.X;
		navCharMenu.y = 500;
		this.addChild(navCharMenu, 5);

		//Level Button
		var level1 = new cc.MenuItemImage(
			"#ui_btn_lvl.png",
			"#ui_btn_lvl.png",
			this.startLevel1,
			this);

		level1.anchorX = 1;
		level1.anchorY = 1;
		level1.x = -233;
		level1.y = 24;

		var level2 = new cc.MenuItemImage(
			"#ui_btn_lvl.png",
			"#ui_btn_lvl.png",
			this.startLevel2,
			this);

		level2.anchorX = 1;
		level2.anchorY = 1;
		level2.x = -105;
		level2.y = 24;

		var level3 = new cc.MenuItemImage(
			"#ui_btn_lvl.png",
			"#ui_btn_lvl.png",
			this.startLevel3,
			this);

		level3.anchorX = 1;
		level3.anchorY = 1;
		level3.x = 23;
		level3.y = 24;

		var level4 = new cc.MenuItemImage(
			"#ui_btn_lvl.png",
			"#ui_btn_lvl.png",
			this.startLevel4,
			this);

		level4.anchorX = 1;
		level4.anchorY = 1;
		level4.x = 151;
		level4.y = 24;

		var level5 = new cc.MenuItemImage(
			"#ui_btn_lvl.png",
			"#ui_btn_lvl.png",
			this.startLevel5,
			this);

		level5.anchorX = 1;
		level5.anchorY = 1;
		level5.x = 279;
		level5.y = 24;

		var level6 = new cc.MenuItemImage(
			"#ui_btn_lvl.png",
			"#ui_btn_lvl.png",
			this.startLevel6,
			this);

		level6.anchorX = 1;
		level6.anchorY = 1;
		level6.x = 345;
		level6.y = -70;

		var level7 = new cc.MenuItemImage(
			"#ui_btn_lvl.png",
			"#ui_btn_lvl.png",
			this.startLevel7,
			this);
		
		level7.anchorX = 1;
		level7.anchorY = 1;
		level7.x = 217;
		level7.y = -70;

		var level8 = new cc.MenuItemImage(
			"#ui_btn_lvl.png",
			"#ui_btn_lvl.png",
			this.startLevel8,
			this);
		
		level8.anchorX = 1;
		level8.anchorY = 1;
		level8.x = 89;
		level8.y = -70;



		var levelMenu = new cc.Menu(level1, level2, level3, level4, level5, level6, level7, level8);
		levelMenu.x = GC.SCREEN.CENTER.X;
		levelMenu.y = GC.SCREEN.CENTER.Y - 100;
		this.addChild(levelMenu, 5);

	},

	processCharacterSelected:function()
	{
		if(this.m_charSelectCounter == 1)
			GC.CURRENT_CHARACTER = GC.CHARACTER_NAME.BEAST;
		else if(this.m_charSelectCounter == 2)
			GC.CURRENT_CHARACTER = GC.CHARACTER_NAME.CYBORG;
		else if(this.m_charSelectCounter == 3)
			GC.CURRENT_CHARACTER = GC.CHARACTER_NAME.RAVEN;
	},

	changeCharacterAnim:function()
	{
		//Reposition BeastBoy
			if(this.m_charSelectCounter == 1)
			{
				this.m_charSelectBB.runAction(cc.moveTo(0.5, cc.p(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y + 70)));
				this.m_charSelectCyb.runAction(cc.moveTo(0.5, cc.p(GC.SCREEN.CENTER.X - 200, GC.SCREEN.CENTER.Y - 30)));
				this.m_charSelectRav.runAction(cc.moveTo(0.5, cc.p(GC.SCREEN.CENTER.X + 150, GC.SCREEN.CENTER.Y - 30)));
				this.m_charSelectCyb.setColor(cc.color(100, 100, 100, 100));
				this.m_charSelectRav.setColor(cc.color(100, 100, 100, 100));
				this.m_charSelectBB.setColor(cc.color(255, 255, 255, 255));
				this.m_charSelectBB.setLocalZOrder(3);
				this.m_charSelectCyb.setLocalZOrder(2);
				this.m_charSelectRav.setLocalZOrder(2);

				//Tools.changeSprite(this.m_charNamePanel, "ui_charSel_beastBoy.png");
				this.changeCharNamePanel(this.m_charNamePanel, "ui_charSel_beastBoy.png");
			}	
			
			else if(this.m_charSelectCounter == 2)
			{
				this.m_charSelectBB.runAction(cc.moveTo(0.5, cc.p(GC.SCREEN.CENTER.X + 150, GC.SCREEN.CENTER.Y - 30)));
				this.m_charSelectCyb.runAction(cc.moveTo(0.5, cc.p(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y + 70)));
				this.m_charSelectRav.runAction(cc.moveTo(0.5, cc.p(GC.SCREEN.CENTER.X - 200, GC.SCREEN.CENTER.Y - 30)));
				this.m_charSelectCyb.setColor(cc.color(255, 255, 255, 255));
				this.m_charSelectRav.setColor(cc.color(100, 100, 100, 100));
				this.m_charSelectBB.setColor(cc.color(100, 100, 100, 100));
				this.m_charSelectBB.setLocalZOrder(2);
				this.m_charSelectCyb.setLocalZOrder(3);
				this.m_charSelectRav.setLocalZOrder(2);

				//Tools.changeSprite(this.m_charNamePanel, "ui_charSel_cyborg.png");
				this.changeCharNamePanel(this.m_charNamePanel, "ui_charSel_cyborg.png");
			}	

			else if(this.m_charSelectCounter == 3)
			{
				this.m_charSelectBB.runAction(cc.moveTo(0.5, cc.p(GC.SCREEN.CENTER.X - 200, GC.SCREEN.CENTER.Y - 30)));
				this.m_charSelectCyb.runAction(cc.moveTo(0.5, cc.p(GC.SCREEN.CENTER.X + 150, GC.SCREEN.CENTER.Y - 30)));
				this.m_charSelectRav.runAction(cc.moveTo(0.5, cc.p(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y + 70)));
				this.m_charSelectCyb.setColor(cc.color(100, 100, 100, 100));
				this.m_charSelectRav.setColor(cc.color(255, 255, 255, 255));
				this.m_charSelectBB.setColor(cc.color(100, 100, 100, 100));
				this.m_charSelectBB.setLocalZOrder(2);
				this.m_charSelectCyb.setLocalZOrder(2);
				this.m_charSelectRav.setLocalZOrder(3);

				//Tools.changeSprite(this.m_charNamePanel, "ui_charSel_raven.png");
				this.changeCharNamePanel(this.m_charNamePanel, "ui_charSel_raven.png");
			}	
		
	},

	changeCharNamePanel:function(target, tag)
	{
			if(this.m_canSelectChar)
			{
				this.m_canSelectChar = false;
				this.m_charNamePanel.runAction(cc.sequence(cc.moveTo(0.2, -300, GC.SCREEN.CENTER.Y + 80),
					cc.delayTime(0.2),
					cc.callFunc(function()
					{
						Tools.changeSprite(target, tag);
					}, this),
					cc.moveTo(0.2, 140, GC.SCREEN.CENTER.Y + 80),
					cc.delayTime(0.1),
					cc.callFunc(function()
						{
							this.m_canSelectChar = true;
						}, this)));
			}
	},

	goToNextChar:function()
	{
		if(this.m_canSelectChar)
		{
			this.m_charSelectCounter++;
			this.changeCharacterAnim();

			if(this.m_charSelectCounter > 3)
			{
				this.m_charSelectCounter = 1;
				this.changeCharacterAnim();
			}

			cc.log(this.m_charSelectCounter);
		}
	},

	goToPrevChar:function()
	{
		if(this.m_canSelectChar)
		{
			this.m_charSelectCounter--;
			this.changeCharacterAnim();

			if(this.m_charSelectCounter < 1)
			{
				this.m_charSelectCounter = 3
				this.changeCharacterAnim();
			}

			cc.log(this.m_charSelectCounter);
		}
	},

	startLevel1:function()
	{
		GC.LEVEL = 1;
		this.processCharacterSelected();
		this.showLoadingScreen();	
	},

	startLevel2:function()
	{
		GC.LEVEL = 2;
		this.processCharacterSelected();
		this.showLoadingScreen();
	},

	startLevel3:function()
	{
		GC.LEVEL = 3;
		this.processCharacterSelected();
		this.showLoadingScreen();
	},

	startLevel4:function()
	{
		GC.LEVEL = 4;
		this.processCharacterSelected();
		this.showLoadingScreen();
	},

	startLevel5:function()
	{
		GC.LEVEL = 5;
		this.processCharacterSelected();
		this.showLoadingScreen();
	},

	startLevel6:function()
	{
		GC.LEVEL = 6;
		this.processCharacterSelected();
		this.showLoadingScreen();
	},

	startLevel7:function()
	{
		GC.LEVEL = 7;
		this.processCharacterSelected();
		this.showLoadingScreen();
	},

	startLevel8:function()
	{
		GC.LEVEL = 8;
		this.processCharacterSelected();
		this.showLoadingScreen();
	},

	goLevel9:function()
	{

	},

	goLevel10:function()
	{

	},

	goLevel11:function()
	{

	},

	goLevel2:function()
	{

	},

	showLoadingScreen:function()
	{
		//Debug
		//var gameScene = new GameplayScene();
		//cc.director.runScene(gameScene);
		if(!this.m_once)
		{
			this.m_once = true;
			var titanPanel1 = new cc.Sprite("#loadingScreen1.png");
			titanPanel1.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y + 1200);
			this.addChild(titanPanel1, 5);

			var titanPanel2 = new cc.Sprite("#loadingScreen2.png");
			titanPanel2.setPosition(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y - 1200);
			this.addChild(titanPanel2, 5);

			titanPanel1.runAction(cc.moveTo(0.5, cc.p(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y)));
			titanPanel2.runAction(cc.moveTo(0.5, cc.p(GC.SCREEN.CENTER.X, GC.SCREEN.CENTER.Y)));
			this.runAction(cc.sequence(cc.delayTime(1),
				cc.callFunc(function()
				{
					var gameScene = new GameplayScene();
					cc.director.runScene(gameScene);
			}, this)));
		}
		
	}

});

var LevelSelectScene = cc.Scene.extend({

	onEnter:function()
	{
		this._super();
		var layer = new LevelSelectLayer();
		this.addChild(layer);
	}

});