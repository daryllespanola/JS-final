var LockLevelButton = cc.Sprite.extend ({
	
	ctor:function(level)
	{
		this._super("#ui_lvlUnplayed.png");
		this.init(level);
	},

	init:function(level)
	{
		var levelNumber = level;
		var levelNumberFont = new cc.LabelBMFont("2", res.font_fnt);
		levelNumberFont.setPosition(this.width / 2, this.height / 2);
		//g_sharedLevelSelLyr.addChild(levelNumberFont);
	}

});
