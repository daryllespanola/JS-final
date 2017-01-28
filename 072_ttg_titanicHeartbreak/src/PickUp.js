var PickUp = cc.Sprite.extend({
	
	m_type:undefined,
	m_velocity:undefined,
	m_gravity:undefined,

	ctor:function(p_type)
	{
		var texture;
		switch(p_type)
		{
			case "Star": texture = "#gobj_pUStar.png";
				break;
			case "ForceField": texture = "#gobj_pUForceField.png";
				break;
			case "Snow": texture = "#gobj_pUSnowflake.png";
				break;
			case "BrokenHeart": texture = "#gobj_pUBrokenHeart.png";
				break;
		}
		this._super(texture);
		this.init(p_type);
	},

	init:function(p_type)
	{
		this.m_type = p_type;
		this.m_velocity = new cc.p(0, 3);
		this.m_gravity = new cc.p(0, -0.2);

		this.scheduleUpdate();
	},

	applyEffect:function(p_type)
	{
		var p_type = this.m_type;

		if(p_type == "Star")
		{
			g_sharedGameplayLyr.addAdditionalTime();
		}

		else if(p_type == "Snow")
		{
			g_sharedGameplayLyr.freezeHearts();
		}

		else if(p_type == "BrokenHeart")
		{
			g_sharedGameplayLyr.destroyAllHeartsOnGame();
		}

		else	g_sharedGameplayLyr.activateForceField();
		
		return cc.log(p_type);
	},

	collideRect:function(x, y)
	{
		var w = this.getContentSize().width;
		var h = this.getContentSize().height;

		return cc.rect(x, y, w, h);
	},

	update:function()
	{
		this.x += this.m_velocity.x;
		this.y += this.m_velocity.y;

		this.m_velocity = cc.pAdd(this.m_velocity, this.m_gravity);

		if(this.y < 62)
		{
			this.m_velocity = new cc.p(0, 0);
		}
	}



});