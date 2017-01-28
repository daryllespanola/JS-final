var HeartFX = cc.Sprite.extend({
	
	act_explode:undefined,

	ctor:function(size)
	{
		this._super("#gobj_heartS.png");
		this.init(size)
	},

	init:function(p_size)
	{
		var size = p_size;
		switch (size)
		{
			case 2: this.act_explode = new Tools.createFramesAnimation("gobj_heartMBurst_", 0.08, 0, 4);
				break;
			case 1: this.act_explode = new Tools.createFramesAnimation("gobj_heartSBurst_", 0.08, 0, 4);
				break;
			case 0: this.act_explode = new Tools.createFramesAnimation("gobj_heartSBurst_", 0.08, 0, 4);
				break;
		}
	
		this.runAction(cc.sequence (cc.fadeOut(0.2),
			cc.callFunc(function()
				{
					this.removeFromParent();
					this.cleanup();
				}, this)));
		this.runAction(this.act_explode);
	}

});