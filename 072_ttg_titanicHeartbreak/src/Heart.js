var Heart = cc.Sprite.extend({

	m_size:undefined,
	m_mass:undefined,
	m_velocity:undefined,
	m_gravity:undefined,
	m_bIsLeftInit:undefined,
	act_rotateLoop:undefined,		
	act_squashV:undefined,
	act_squashH:undefined,
	m_bIsDestroy:undefined,
	m_bisAlive:undefined,
	m_bIsFreeze:undefined,

	ctor:function()
	{
		this._super("#gobj_heartS.png");
		this.moveToPool();
	},

	init:function(p_isLeftInit, p_size, x, y)
	{
		this.setPosition(x, y);
		//cc.log(this.getPosition());
		this.m_size = p_size;
		switch(this.m_size)
		{
			case 5: Tools.changeSprite(this, "gobj_heartXXL.png"); 
				break;
			case 4: Tools.changeSprite(this, "gobj_heartXL.png"); 
				break;
			case 3: Tools.changeSprite(this, "gobj_heartL.png"); 
				break;
			case 2: Tools.changeSprite(this, "gobj_heartM.png"); 
				break;
			case 1: Tools.changeSprite(this, "gobj_heartS.png"); 
				break;
			case 0: Tools.changeSprite(this, "gobj_heartXS.png"); 
				break;
		}

		this.m_bisAlive = true;
		this.m_isInitialSpawn = false;
		this.m_isFreeze = false;
		this.m_bIsLeftInit = p_isLeftInit;
		var dir;

		if(this.m_bIsLeftInit)
				dir = -1.69;
		else  dir = 1.69;

		this.m_mass = 1;
		this.m_velocity = new cc.p(dir, 0.1);
		this.m_acceleration = new cc.p(0, 0);
		this.m_gravity = new cc.p(0, -0.1);

		this.act_rotateLoop = new cc.RepeatForever(cc.sequence(cc.rotateBy(2, 45),
                    cc.rotateBy(2, -45),
                    cc.rotateBy(2, -45),
                    cc.rotateBy(2, 45)));

		this.act_squashV = new cc.sequence(cc.scaleTo(0.1, 1, 0.7),
					cc.scaleTo(0.2, 1, 1));
		this.act_squashH = new cc.sequence(cc.scaleTo(0.1, 0.8, 1),
					cc.scaleTo(0.2, 1, 1));
	},

	moveToPool:function()
	{
		this.m_bisAlive = false;
		this.setPosition(999999, 999999);
		this.setOpacity(0);
		this.cleanup();
	},

	reuse:function(p_isInitial, p_isLeftInit, p_size, x, y)
	{
		var bIsInitial = p_isInitial;

		this.setOpacity(255);
		this.init(p_isLeftInit, p_size, x, y);

		if(!bIsInitial)
			this.startSimulation();
	},

	startSimulation:function()
	{
		this.runAction(this.act_rotateLoop);
		this.scheduleUpdate();
	},
	
	squashScale:function(p_dir)
	{
		if(p_dir == "Top" || p_dir == "Bot")
		{
			this.runAction(this.act_squashV);
		}
	},

	collideObstacle:function(p_dir)
	{
		if(p_dir == "Top")
		{
			this.m_velocity.y *= -6.5;
			this.squashScale(p_dir);
			//cc.log("HIT TOP");
		}
		else if(p_dir == "Bot")
		{
			this.m_velocity.y *= -6.5;
			this.squashScale(p_dir);
			//cc.log("HIT BOTTOM");
		} 

		else if(p_dir == "Left")
		{
			this.m_velocity.x *= -1;
			this.squashScale(p_dir);
			//cc.log("Hit Left");
		}

		else if(p_dir == "Right")
		{
			this.m_velocity.x *= -1;
			this.squashScale(p_dir);
			//cc.log("Hit Right");
		}

	},

	checkEdges:function()
	{
		if(this.x > GC.SCREEN.SIZE.WIDTH - 200)
		{
			this.x = GC.SCREEN.SIZE.WIDTH - 200;
			this.m_velocity.x *= -1;
		}

		else if(this.x < 200)
		{
			this.x = 200;
			this.m_velocity.x *= -1;
		}

		if(this.y < 50)
		{
			this.y = 50;
			this.m_velocity.y *= -6.5;
			this.squashScale("Bot");
		}
	},

	collideRect:function(x, y)
	{
		var w = this.getContentSize().width;
		var h = this.getContentSize().height;

		return cc.rect(x - (w / 2), y - (h / 2), w, h);
	},

	destroy:function()
	{
		if(!this.m_bIsDestroy && this.m_bisAlive)
		{
			g_sharedGameplayLyr.updateKillCount();
			cc.log(g_sharedGameplayLyr.m_heartsKillCount);
			this.m_bIsDestroy = true;
			this.m_bisAlive = false;
			g_sharedGameplayLyr.spawnHeartFX(this.m_size, this.x , this.y);
			this.setOpacity(0);
			this.runAction(cc.sequence(cc.delayTime(0.05),
				cc.callFunc(function()
				{
					g_sharedGameplayLyr.multiplyHeart(this.m_size - 1, this.x, this.y);
					this.moveToPool();
				}, this)));
			this.unscheduleUpdate();
		}
	},

	freeze:function()
	{
		if(this.m_bisAlive)
		{
			if(this.m_bIsFreeze) return;
			this.m_bIsFreeze = true;
			this.unscheduleUpdate();
			this.stopAllActions();

			this.runAction(cc.sequence(cc.delayTime(2),
				cc.fadeOut(0.2),
				cc.fadeIn(0.2),
				cc.fadeOut(0.1),
				cc.fadeIn(0.1),
				cc.fadeOut(0.1),
				cc.fadeIn(0.1),
				cc.fadeOut(0.1),
				cc.fadeIn(0.1),
				cc.fadeOut(0.1),
				cc.fadeIn(0.1),
				cc.fadeOut(0.1),
				cc.fadeIn(0.1),
				cc.fadeOut(0.1),
				cc.fadeIn(0.1),
				cc.fadeOut(0.1),
				cc.fadeIn(0.1),
				cc.fadeOut(0.1),
				cc.fadeIn(0.1)));

			this.runAction(cc.sequence(cc.delayTime(4),
				cc.callFunc(function()
				{
					this.m_bIsFreeze = false;
					this.scheduleUpdate();
					this.runAction(this.act_rotateLoop);
				}, this)));
		}
	},

	update:function()
	{
		this.m_velocity.y = cc.clampf(this.m_velocity.y, -6.5, 6.5);

		this.x += this.m_velocity.x;
		this.y += this.m_velocity.y;
		this.m_velocity = cc.pAdd(this.m_velocity, this.m_gravity);

		this.checkEdges();
		
	}
});