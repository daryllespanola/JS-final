var Heart = cc.Sprite.extend({

	/*
	m_velocity:undefined,
	m_acceleration:undefined,
	m_gravity:undefined,
	m_computedForce:undefined,

	m_fixedFlightForce:undefined,
	m_isLaunched:undefined,
	m_isFalling:undefined,

	m_bisOnce:undefined,
	*/
	m_size:undefined,
	m_mass:undefined,
	m_velocity:undefined,
	m_acceleration:undefined,
	m_gravity:undefined,
	m_isLeftInit:undefined,
	act_rotateLoop:undefined,		
	act_squashV:undefined,
	act_squashH:undefined,
	m_isDestroy:undefined,
	m_isFreeze:undefined,

	ctor:function(p_isLeftInit, size)
	{
		var texture;
		switch(size)
		{
			case 2: texture = "#gobj_heartM.png";
				break;
			case 1: texture = "#gobj_heartS.png";
				break;
			case 0: texture = "#gobj_heartXS.png";
				break;
		}

		this._super(texture);
		this.m_size = size;
		this.init(p_isLeftInit);
	},

	init:function(p_isLeftInit)
	{
		this.m_isInitialSpawn = false;
		this.m_isDestroy = false;
		this.m_isFreeze = false;
		this.m_isLeftInit = p_isLeftInit;
		var dir;

		if(this.m_isLeftInit)
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

	startSimulation:function()
	{
		this.runAction(this.act_rotateLoop);
		this.scheduleUpdate();
	},

	//Simulates Newton's second law
	applyForce:function(p_force)
	{
		var f = cc.p(p_force.x / this.m_mass, p_force.y / this.m_mass);
		this.m_acceleration = cc.pAdd(this.m_acceleration, f);
	},

	squashScale:function(p_dir)
	{
		if(p_dir == "Top" || p_dir == "Bot")
		{
			this.runAction(this.act_squashV);
		}
	},

	/*
	calculateWallForce:function()
	{
		
		var limit1 = 0;
		var limit2 = 0;

		if(this.x > GC.SCREEN.SIZE.WIDTH)
		{
			limit1 = -1;
		}

		else if(this.x < 0)
		{
			limit1 = 1;
		}

		if(this.y < 100)
		{
			limit2 = 1;
		}

		return new cc.p(limit1, limit2);
		
	},
	*/

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

	collideObstacle2:function()
	{
		//this.m_velocity.x *= -1;
		cc.log("DAR");
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
		if(!this.m_isDestroy)
		{
			this.m_isDestroy = true;
			g_sharedGameplayLyr.spawnHeartFX(this.m_size, this.x , this.y);
			this.setOpacity(0);
			this.runAction(cc.sequence(cc.delayTime(0.05),
				cc.callFunc(function()
				{
					g_sharedGameplayLyr.multiplyHeart(this.m_size - 1, this.x, this.y);
					this.cleanup();
					this.setOpacity(0);
				}, this)));
			this.unscheduleUpdate();
			g_sharedGameplayLyr.m_toDelete.push(this);
		}
	},

	freeze:function()
	{
		if(this.m_isFreeze) return;
		this.m_isFreeze = true;
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
				this.m_isFreeze = false;
				this.scheduleUpdate();
				this.runAction(this.act_rotateLoop);
			}, this)));
	},

	update:function()
	{
		//var wallForce = this.calculateWallForce();
		//this.applyForce(wallForce);
		//cc.log(this.m_velocity.y);
	
		this.m_velocity.y = cc.clampf(this.m_velocity.y, -6.5, 6.5);

		this.x += this.m_velocity.x;
		this.y += this.m_velocity.y;
		this.m_velocity = cc.pAdd(this.m_velocity, this.m_gravity);

		this.m_acceleration = cc.pMult(this.m_acceleration, 0);

		//var wind = cc.p(0.001, 0);
		//var gravity = cc.p(0, -0.1);
		//this.applyForce(wind);
		//this.applyForce(gravity);

		this.checkEdges();
		
	}



	/*
	init:function()
	{
		this.setPosition(550, 250);	
		this.setScale(0.3);

		//values
		this.m_velocity = cc.p(0, 0);
		this.m_acceleration = cc.p(0, 0);
		this.m_gravity = cc.p(0, 0);
		this.m_fixedFlightForce = cc.p(0.2, 1.6);
		this.m_isLaunched = false;
		this.m_isFalling = false;

		this.m_bisOnce = false;

		this.runAction(cc.sequence(cc.delayTime(1), 
			cc.callFunc(function()
			{
				this.launch();
			}, this)));

		this.scheduleUpdate();	
	},

	applyMovement:function()
	{
		this.m_velocity = cc.pAdd(this.m_velocity, this.m_acceleration);
		this.setPosition(this.x += this.m_velocity.x, this.y += this.m_velocity.y);

		this.m_velocity.x = cc.clampf(this.m_velocity.x, -3, 3);
		this.m_velocity.y = cc.clampf(this.m_velocity.y, -2, 100);
	},

	applyForce:function(force)
	{
		this.m_computedForce = new cc.p(force.x, force.y);
		this.m_acceleration = cc.pAdd(this.m_acceleration, this.m_computedForce);
	},

	launch:function()
	{
		this.applyForce(this.m_fixedFlightForce);
		this.m_isLaunched = true;
	},

	resetMovement:function()
	{
		this.m_velocity = new cc.p(0, 0);
		this.m_acceleration = new cc.p(0, 0);
	},

	checkEdges:function()
	{
		if(this.m_isLaunched)
		{
			if(this.y <= 200)
			{
				this.resetMovement();
				this.m_isLaunched = false;
				this.runAction(cc.sequence(cc.delayTime(0.05),
					cc.callFunc(function()
					{
						this.launch();
						this.m_isLaunched = true;
						this.m_isFalling = false;
					}, this)));

			}

			else if(this.x >= GC.SCREEN.SIZE.WIDTH - 200 && !this.m_bisOnce)
			{
				this.m_bisOnce = true;
				this.m_velocity.x = this.m_velocity.x * -1;
				this.m_velocity.y = this.m_velocity.y * -1;
				//this.m_acceleration.x = this.m_acceleration * -1;
				this.m_fixedFlightForce = cc.p(0.2 * -1, 1.6);
				//this.applyForce(this.m_fixedFlightForce);
				//cc.log("Must turn");
				this.runAction(cc.sequence(cc.delayTime(0.1),
					cc.callFunc(function()
					{
						this.m_bisOnce = false;
					}, this)));
			}

			else if(this.x <= 200 && !this.m_bisOnce)
			{
				this.m_bisOnce = true;
				this.m_velocity.x = this.m_velocity.x * -1;
				this.m_velocity.y = this.m_velocity.y * -1;
				//this.m_acceleration.x = this.m_acceleration * -1;
				this.m_fixedFlightForce = cc.p(0.2 , 1.6);
				//this.applyForce(this.m_fixedFlightForce);
				//cc.log("Must turn");
				this.runAction(cc.sequence(cc.delayTime(0.1),
					cc.callFunc(function()
					{
						this.m_bisOnce = false;
					}, this)));
			}
		}
	},

	update:function()
	{
		this.applyMovement();	
		this.checkEdges();
		
		if(this.m_isLaunched)
		{
			this.m_gravity = cc.p(0, -0.1);
			this.applyForce(this.m_gravity);
		}

		if(this.m_velocity.y <= -1 && !this.m_isFalling)
		{
			this.m_isFalling = true;
			this.m_acceleration.x = 0;
		}
	}
	*/
});