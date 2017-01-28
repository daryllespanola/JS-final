var Player = cc.Sprite.extend ({
	
	m_isMoving:undefined,

	m_isLowerIdle:undefined,
	m_isLowerWalk:undefined,
	m_isUpperShooting:undefined,

	m_velocity:undefined,
	m_direction:undefined,
	m_isFacingLeft:undefined,
	m_type:undefined,
	m_sourcePosProjectile:undefined,

	m_upper:undefined,
	m_lower:undefined,

	act_upperIdle:undefined,
	act_upperWalk:undefined,
	act_upperShoot:undefined,
	act_upperHit:undefined,
	act_RavenHover:undefined,

	act_lowerIdle:undefined,
	act_lowerWalk:undefined,
	act_lowerHit:undefined,

	m_timer:undefined,
	m_fireRate:undefined,


	ctor:function(p_type)
	{
		this.m_type = p_type;
		this._super(res.temp_obj);
		this.init();
	},

	setParts:function(p_upper, p_lower)
	{
		this.m_upper = new cc.Sprite("#"+ p_upper);
		this.m_lower = new cc.Sprite("#"+ p_lower);

		this.addChild(this.m_upper, 2);
		this.addChild(this.m_lower, 1);
		this.m_upper.setPosition(this.width / 2, this.height / 2);
		this.m_lower.setPosition(this.width / 2, this.height / 2);
	},

	setAnimation:function(p_upper_idle, p_upper_idle_interval, p_upper_idle_start, p_upper_idle_end, 
		p_upper_walk, p_upper_walk_interval, p_upper_walk_start, p_upper_walk_end,
		p_upper_shoot, p_upper_shoot_interval, p_upper_shoot_start, p_upper_shoot_end,
		p_upper_hit, p_upper_hit_interval, p_upper_hit_start, p_upper_hit_end,
		p_lower_idle, p_lower_idle_interval, p_lower_idle_start, p_lower_idle_end,
		p_lower_walk, p_lower_walk_interval, p_lower_walk_start, p_lower_walk_end,
		p_lower_hit, p_lower_hit_interval, p_lower_hit_start, p_lower_hit_end)
	{
		this.act_upperIdle = new cc.RepeatForever(Tools.createFramesAnimation(p_upper_idle, p_upper_idle_interval,
			p_upper_idle_start, p_upper_idle_end));
		this.act_upperWalk = new cc.RepeatForever(Tools.createFramesAnimation(p_upper_walk, p_upper_walk_interval,
			p_upper_walk_start, p_upper_walk_end));
		this.act_upperShoot = new Tools.createFramesAnimation(p_upper_shoot, p_upper_shoot_interval, 
			p_upper_shoot_start, p_upper_shoot_end);
		this.act_upperHit = new Tools.createFramesAnimation(p_upper_hit, p_upper_shoot_interval, 
			p_upper_hit_start, p_upper_hit_end);

		this.act_lowerIdle = new cc.RepeatForever(Tools.createFramesAnimation(p_lower_idle, p_lower_idle_interval,
			p_lower_idle_start, p_lower_idle_end));
		this.act_lowerWalk = new cc.RepeatForever(Tools.createFramesAnimation(p_lower_walk, p_lower_walk_interval, 
			p_lower_walk_start, p_lower_walk_end));
		this.act_lowerHit = new Tools.createFramesAnimation(p_lower_hit, p_lower_hit_interval, 
			p_lower_hit_start, p_lower_hit_end);

		this.entryCharacter();
	},

	entryCharacter:function()
	{
		this.playWalk();
		this.runAction(cc.sequence(cc.moveTo(1.7, GC.SCREEN.CENTER.X, 100),
			cc.callFunc(function()
				{
					this.m_upper.stopAction(this.p_upper_walk);
					this.m_lower.stopAction(this.p_lower_walk);

					this.playInitialAnimation();
				}, this)));
	},

	playInitialAnimation:function()
	{
		this.playIdle();

		if(this.m_type == "Raven")
		{
			this.act_RavenHover = new cc.RepeatForever(cc.sequence(cc.moveBy( 0.7, 0, 6 ),
                    cc.moveBy( 0.7, 0, -6 ).easing( cc.easeSineIn())));

			this.runAction(this.act_RavenHover);
		}
	},

	setDirection:function(dir, isFacingLeft)
	{
		this.setScale(dir, 1);
		this.m_isFacingLeft = isFacingLeft;

		this.setSourcePositionProjectile();
	},

	setSourcePositionProjectile:function()
	{
		var sourceX;
		var sourceY;

		if(this.m_type == "BeastBoy")
		{
			sourceX = 25;
			sourceY = 30;
		}
		else if(this.m_type == "Cyborg")
		{
			sourceX = 50;
			sourceY = 35;
		}

		//Implementation
		if(this.m_isFacingLeft)
		{
			this.m_sourcePosProjectile = new cc.p(-sourceX, sourceY);
		}

		else
			this.m_sourcePosProjectile = new cc.p(sourceX, sourceY);

	},

	setFireRate:function()
	{
		if(this.m_type == "BeastBoy")
		{
			this.m_fireRate = 0.3;
		}

		else if(this.m_type == "Cyborg")
		{
			this.m_fireRate = 0.8;
		}
	},

	init:function()
	{
		this.setPosition(-100, 100);
		this.setOpacity(0);
		this.m_isIdle = false;
		this.m_isMoving = false;
		this.m_isAnimWalk = false;
		this.m_isShooting = false;
		this.m_isFacingLeft = false;
		this.m_velocity = 7;
		this.m_direction = 1;
		this.m_timer = 0;

		this.setSourcePositionProjectile();
		this.setFireRate();

		//this.playIdle();
		this.scheduleUpdate();
	},

	playIdle:function()
	{
		if(!g_sharedGameplayLyr.m_isPlayerDead)
		{
			//From walk
			if(this.m_isLowerWalk)
			{
				this.m_lower.stopAction(this.act_lowerWalk);
			}

			//From shoot
			if(!this.m_isShooting)
			{
				this.m_upper.runAction(this.act_upperIdle);

				if(this.m_isLowerWalk)
				{
					this.m_upper.stopAction(this.act_upperWalk);
				}
			}

			//Ignore upper states
			this.m_lower.runAction(this.act_lowerIdle);

			this.m_isLowerIdle = true;
			this.m_isLowerWalk = false;
		}
	},

	playWalk:function()
	{
		if(!g_sharedGameplayLyr.m_isPlayerDead)
		{
			//From idle
			if(this.m_isLowerIdle)
			{
				this.m_lower.stopAction(this.act_lowerIdle);
			}

			//From walk
			if(!this.m_isShooting)
			{
				this.m_upper.runAction(this.act_upperWalk);

				if(this.m_isLowerIdle)
				{
					
					this.m_upper.stopAction(this.act_upperIdle);
				}
			}

			//Ignore upper states
			this.m_lower.runAction(this.act_lowerWalk);

			this.m_isLowerIdle = false;
			this.m_isLowerWalk = true;
		}
	},

	playShoot:function()
	{
		if(this.m_isShooting) return;

		else
		{
			//From idle

			if(this.m_isLowerIdle)
			{
				this.m_isShooting = true;
				this.m_upper.stopAction(this.act_upperIdle);
				this.m_isLowerIdle = true;
				this.m_isLowerWalk = false;
			}

			//From Walk

			if(this.m_isLowerWalk)
			{
				this.m_isShooting = true;
				this.m_upper.stopAction(this.act_upperWalk);
				this.m_isLowerIdle = false;
				this.m_isLowerWalk = true;
			}

			this.m_upper.runAction(this.act_upperShoot);
			g_sharedGameplayLyr.reuseWeaponFromPool();
		}
	},

	playHit:function()
	{
		this.m_upper.stopAllActions();
		this.m_lower.stopAllActions();

		this.m_upper.runAction(this.act_upperHit);
		this.m_lower.runAction(this.act_lowerHit);
	},

	triggerMovement:function(p_dir, p_isMoving)
	{
		this.m_direction = p_dir;
		this.m_isMoving = p_isMoving;
	},

	collideRect:function(x, y)
	{
		var w = this.getContentSize().width;
		var h = this.getContentSize().height;

		return cc.rect(x, y, w / 2, h / 2);
	},
	
	update:function(dt)
	{
		if(this.m_isMoving)
		{
			this.setPosition(this.x += this.m_velocity * this.m_direction, this.y);
			this.x = cc.clampf(this.x, 250, GC.SCREEN.SIZE.WIDTH - 250);

			if(this.m_direction == -1)
				this.setDirection(-1, true);
			else 
				this.setDirection(1, false);

			if(!this.m_isAnimWalk)
			{
				this.m_isAnimWalk = true;
				this.playWalk();
			}
		}

		if(this.m_isShooting)
		{
			if(this.m_timer < this.m_fireRate)
			{
				this.m_timer += dt;

				if(this.m_timer >= this.m_fireRate)
				{
					this.m_isShooting = false;
					this.m_timer = 0;

					//Automatically change animation when shooting anim frames is done
					if(this.m_isLowerIdle)
					{
						this.m_upper.stopAction(this.act_upperShoot);
						this.m_upper.runAction(this.act_upperIdle);
					}

					else if(this.m_isLowerWalk)
					{
						this.m_upper.stopAction(this.act_upperShoot);
						this.m_upper.runAction(this.act_upperWalk);
					}
				}
			}
		}
	}

});