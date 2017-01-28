var Projectile = cc.Sprite.extend ({

	m_velocity:undefined,
	m_rotation:undefined,
	m_isCollided:undefined,
	act_collided:undefined,

	m_type:undefined,
		
	ctor:function(p_type)
	{
		var texture;
		switch(p_type)
		{
			case "BeastBoy": texture = "#fx_beastboyBlast_0.png";
				this.act_collided = new Tools.createFramesAnimation("fx_beastboyBlast_", 0.01, 0, 4);
				break;
			case "Cyborg": texture = "#fx_cyborgBeam_0.png";
				this.act_collided = new Tools.createFramesAnimation("fx_cyborgBeam_", 0.01, 0, 2);
				break;
		}
		this.m_type = p_type;
		this._super(texture);
		this.moveToPool();
	},

	init:function(x, y, p_velX, p_velY, p_rot)
	{
		this.m_velocity = new cc.p(p_velX, p_velY);
		this.m_rotation = p_rot;
		this.m_isCollided = false;
		this.setPosition(x, y);
		this.setRotation(this.m_rotation);
	},

	moveToPool:function()
	{
		this.setPosition(9999, 9999);
		this.setOpacity(255);
		this.cleanup();
	},

	reuse:function(x, y, p_velX, p_velY, p_rot)
	{
		if(this.m_type == "BeastBoy")
		{
			Tools.changeSprite(this, "fx_beastboyBlast_0.png");
		}
		else if(this.m_type == "Cyborg")
		{
			Tools.changeSprite(this, "fx_cyborgBeam_0.png");
		}

		this.init(x, y, p_velX, p_velY, p_rot);
		this.scheduleUpdate();
	},

	playCollideAnimation:function()
	{
		this.m_isCollided = true;
		this.runAction(this.act_collided);
		this.unscheduleUpdate();
		
		this.runAction(cc.sequence(cc.delayTime(0.01),
			cc.fadeOut(0.1),
			cc.callFunc(function()
				{
					this.moveToPool();
				}, this)));
		
	},

	collideRect:function(x, y)
	{
		var w = this.getContentSize().width;
		var h = this.getContentSize().height;

		if(!this.m_isCollided)
		return cc.rect(x - (w / 2), y - (h / 2), w, h);
		else
		return cc.rect(-99999, -99999, 0, 0);
	},

	update:function()
	{
		if(!this.m_isCollided)
		{
			this.setPosition(this.x += this.m_velocity.x, this.y += this.m_velocity.y);
		}

		if(this.y >= GC.SCREEN.SIZE.HEIGHT)
		{
			//this.playCollideAnimation();
			this.moveToPool();
		}
	}

});