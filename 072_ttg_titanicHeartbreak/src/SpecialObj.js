var Glass = cc.Sprite.extend({

	act_destroy:undefined,
	m_type:undefined,
	m_bIsDestroy:undefined,

	ctor:function(p_size)
	{
		var ID = "#gobj_Glass" + p_size + "_0.png";
		this._super(ID);
		this.m_type = "Special";
		this.init(p_size);
	},

	init:function(p_size)
	{
		var size = p_size;

		switch(size)
		{
			case 4: this.act_destroy = new Tools.createFramesAnimation("gobj_Glass4_", 0.03, 1, 6);
				break;
			case 3: this.act_destroy = new Tools.createFramesAnimation("gobj_Glass3_", 0.03, 1, 6);
				break;
			case 2: this.act_destroy = new Tools.createFramesAnimation("gobj_Glass2_", 0.03, 1, 6);
				break;
			case 1: this.act_destroy = new Tools.createFramesAnimation("gobj_Glass1_", 0.03, 1, 6);
				break;
		}
	},

	playFXAnim:function()
	{
		this.m_bIsDestroy = true;
		this.runAction(this.act_destroy);
		this.runAction(cc.sequence(cc.delayTime(0.1),
			cc.fadeOut(0.1)));
	},

	collideRect:function(x, y)
	{
		var w = this.getContentSize().width;
		var h = this.getContentSize().height;

		if(!this.m_bIsDestroy)
		{
			return cc.rect(x - (w / 2), y - (h / 2), w, h);
		}
		
		else return cc.rect(0, 0, 0, 0);
	},

});

var PowerUp = cc.Sprite.extend({

	act_destroy:undefined,
	m_type:undefined,

	ctor:function()
	{
		this._super("#gobj_PowerUp_0.png");
		this.m_type = "Special";
		//this.drawCollider(true);
		this.init();
	},

	init:function()
	{
		this.act_destroy = new Tools.createFramesAnimation("gobj_PowerUp_", 0.03, 1, 6);
	},

	playFXAnim:function()
	{
		this.m_isDestroyed = true;
		g_sharedGameplayLyr.spawnPickUp(this.x, this.y);
		this.runAction(this.act_destroy);

		this.runAction(cc.sequence(cc.delayTime(0.1),
			cc.fadeOut(0.1)));
		
	},

	collideRect:function(x, y)
	{
		var w = this.getContentSize().width;
		var h = this.getContentSize().height;

		if(!this.m_isDestroyed)
		{
			return cc.rect(x - (w / 2), y - (h / 2), w, h);
		}
		
		else return cc.rect(0, 0, 0, 0);
	},

	drawCollider:function(show) {
		if (show) {
			var collider = new cc.DrawNode();
            var origin = cc.p(this.x, this.y);
            cc.log(origin);
            var destination = cc.p(this.getContentSize().width, this.getContentSize().height);
            collider.drawRect(origin, destination, cc.color(0,0,0,100));
            this.addChild(collider);
		}
	},
});

var CeilingFan = cc.Sprite.extend({

	m_type:undefined,

	act_spin:undefined,
	m_bisAWake:undefined,
	m_bisSleeping:undefined,
	m_fireRate:undefined,
	m_sleepTime:undefined,
	m_timer:undefined,

	m_projectile:undefined,

	ctor:function(p_initialDelayTime)
	{
		this._super("#gobj_CeilingFan_0.png");
		this.m_type = "Special";
		this.init(p_initialDelayTime);
		//this.drawCollider(true);
	},

	init:function(p_initialDelayTime)
	{
		this.m_bisAWake = false;
		this.m_timer = 0;
		this.m_fireRate = 3;
		this.m_sleepTime = 8;
		this.m_bisSleeping = false;

		this.act_spin = new cc.RepeatForever(Tools.createFramesAnimation("gobj_CeilingFan_", 0.03, 1, 6));

		this.runAction(cc.sequence(cc.delayTime(p_initialDelayTime),
			cc.callFunc(function()
			{
				this.scheduleUpdate();
				this.runAction(this.act_spin);
				this.m_bisAWake = true;
			}, this)));

		this.m_projectile = new RainbowProjectile();
		g_sharedGameplayLyr.m_fxBatchNode.addChild(this.m_projectile);
		g_sharedGameplayLyr.m_rainbowProj.push(this.m_projectile);
	},

	animateFire:function()
	{
		this.runAction(cc.sequence(cc.scaleTo(0.1, 1.1, 1.4), cc.scaleTo(0.2, 1, 1)));

		this.m_projectile.reuse(this.x, this.y);
	},

	playFXAnim:function()
	{
		if(!this.m_bisSleeping && this.m_bisAWake)
		{
			this.stopAction(this.act_spin);
			Tools.changeSprite(this, "gobj_CeilingFan_0.png");
			this.m_bisSleeping = true;
			this.m_bisAWake = false;
		}
	},

	collideRect:function(x, y)
	{
		var w = this.getContentSize().width;
		var h = this.getContentSize().height;

		return cc.rect(x - (w / 2), y - (h / 2), w, h);
	},

	drawCollider:function(show) {
		if (show) {
			var collider = new cc.DrawNode();
            var origin = cc.p(this.x, this.y);
            cc.log(origin);
            var destination = cc.p(this.getContentSize().width, this.getContentSize().height);
            collider.drawRect(origin, destination, cc.color(0,0,0,100));
            this.addChild(collider);
		}
	},

	update:function(dt)
	{
		if(this.m_bisAWake)
		{
			if(this.m_timer < this.m_fireRate)
			{
				this.m_timer += dt;

				if(this.m_timer >= this.m_fireRate)
				{
					this.m_timer = 0;
					this.animateFire();
				}
			}
		}	

		if(this.m_bisSleeping && !this.m_bisAWake)
		{
				if(this.m_timer < this.m_sleepTime)
				{
					this.m_timer += dt;

					if(this.m_timer > this.m_sleepTime)
					{
						this.m_timer = 0;
						this.m_bisSleeping = false;
						this.m_bisAWake = true;
						this.runAction(this.act_spin);
					}
				}
		}	
	}

});

var RainbowProjectile = cc.Sprite.extend({

	act_destroy:undefined,
	m_velocity:undefined,

	m_bisDestroy:undefined,

	ctor:function()
	{
		this._super("#fx_rainbow_0.png");
		this.moveToPool();
	},

	init:function(x, y)
	{
		this.setPosition(x, y - 50);
		this.setOpacity(255);
		this.m_bisDestroy = false;
		this.m_velocity = new cc.p(0, -1);
		this.act_destroy = new Tools.createFramesAnimation("fx_rainbow_", 0.01, 1, 3);
	},

	reuse:function(x, y)
	{
		cc.log("Shoot");
		Tools.changeSprite(this, "fx_rainbow_0.png");
		this.init(x, y);
		this.scheduleUpdate();
	},

	moveToPool:function()
	{
		this.setPosition(9999, 9999);
		this.setOpacity(255);
		this.cleanup();
	},

	destroy:function()
	{
		this.runAction(this.act_destroy);
		this.runAction(cc.fadeOut(0.05));
		this.unscheduleUpdate();
		this.m_bisDestroy = true;
	},

	collideRect:function(x, y)
	{
		var w = this.getContentSize().width;
		var h = this.getContentSize().height;

		if(!this.m_bisDestroy)
		return cc.rect(x - (w / 2), y - (h / 2), w, h);
		else
		return cc.rect(-99999, -99999, 0, 0);
	},

	update:function()
	{
		this.y += this.m_velocity.y * 5;
		if(this.y < 100)
		{	
			if(!this.m_bisDestroy)
			{
				this.destroy();
			}
		}	
	}

});

var SmileyBulb = cc.Sprite.extend({

	act_timeExplode:undefined,
	m_velocity:undefined,
	m_bIsGrounded:undefined,
	m_type:undefined,
	m_bIsAwake:undefined,

	ctor:function()
	{	
		this._super("#gobj_HappyLightbulb_0.png");
		this.m_type = "Smiley";
		this.init();
	},

	init:function()
	{
		this.m_velocity = new cc.p(0, -1);
		this.m_bIsGrounded = false;
		this.m_bIsAwake = false;
		this.act_timeExplode = new Tools.createFramesAnimation("gobj_HappyLightbulb_", 0.02, 2, 9);
	},

	awake:function()
	{
		if(!this.m_bIsAwake)
		{
			this.m_bIsAwake = true;
			this.scheduleUpdate();
			Tools.changeSprite(this, "gobj_HappyLightbulb_1.png");
		}
	},

	activateTimeBomb:function()
	{
		//Blink Effect
		this.runAction(cc.sequence(cc.delayTime(2.5),
			cc.fadeOut(0.15),
			cc.fadeIn(0.15),
			cc.fadeOut(0.2),
			cc.fadeIn(0.2),
			cc.fadeOut(0.1),
			cc.fadeIn(0.1),
			cc.fadeOut(0.1),
			cc.fadeIn(0.1),
			cc.fadeOut(0.1),
			cc.fadeIn(0.1),
			cc.fadeOut(0.1),
			cc.fadeIn(0.1)));

		//Play Explosion
		this.runAction(cc.sequence(cc.delayTime(4),
			cc.callFunc(function()
			{
				this.applyExplosionResponse();
				this.runAction(this.act_timeExplode);
			}, this),
			cc.fadeOut(0.2)));
	},

	applyExplosionResponse:function()
	{
		var distance = cc.pDistance(this.getPosition(), g_sharedGameplayLyr.m_player.getPosition());

		if(distance < 70)
		{
			g_sharedGameplayLyr.applyDamage();
		}
	},

	collideRect:function(x, y)
	{
		var w = this.getContentSize().width;
		var h = this.getContentSize().height;

		if(!this.m_bIsGrounded)
			return cc.rect(x - (w / 2), y - (h / 2), w, h);
		else if(this.m_bIsGrounded)
			return cc.rect(-999999, -999999, 0, 0);
	},

	update:function()
	{
		if(!this.m_bIsGrounded)
			this.y += this.m_velocity.y * 4;
		
		if(this.y < 62)
		{
			if(!this.m_bIsGrounded)
			{
				this.m_bIsGrounded = true;
				this.activateTimeBomb();
			}
		}
	
	}

});

var Trigger = cc.Sprite.extend({

	m_currentFunc:undefined,
	m_bisOn:undefined,
	m_type:undefined,
	m_timer:undefined,
	m_timeInterval:undefined,

	ctor:function(defineFunc)
	{
		this._super("#gobj_trigger_0.png");
		this.m_type = "Special";
		this.m_currentFunc = defineFunc;
		this.init();
	},

	init:function()
	{
		this.m_bisOn = false;
		this.m_timer = 0;
		this.m_timeInterval = 5;
		this.scheduleUpdate();
		cc.log(this.m_currentFunc);
	},

	playFXAnim:function()
	{
		if(this.m_currentFunc == "RightBox" && !this.m_bisOn)
		{
			this.m_bisOn = true;
			Tools.changeSprite(this, "gobj_trigger_1.png");
			cc.log("Right Hit");
		}

		else if(this.m_currentFunc == "LeftBox" && !this.m_bisOn)
		{
			this.m_bisOn = true;
			Tools.changeSprite(this, "gobj_trigger_1.png");
			cc.log("Left Hit");
		}

		else if(this.m_currentFunc == "OpenLeft" && !this.m_bisOn)
		{
			this.m_bisOn = true;
			Tools.changeSprite(this, "gobj_trigger_1.png");
			cc.log("Open Left Door");
			g_sharedGameplayLyr.processMetalDoor("OpenLeft");
		}

		else if(this.m_currentFunc == "OpenRight" && !this.m_bisOn)
		{
			this.m_bisOn = true;
			Tools.changeSprite(this, "gobj_trigger_1.png");
			cc.log("Open Right Door");
			g_sharedGameplayLyr.processMetalDoor("OpenRight");
		}

		else if(this.m_currentFunc == "OpenMid" && !this.m_bisOn)
		{
			this.m_bisOn = true;
			Tools.changeSprite(this, "gobj_trigger_1.png");
			cc.log("Open Mid Door");
			g_sharedGameplayLyr.processMetalDoor("OpenMid");
		}

		else if(this.m_currentFunc == "OpenMidLeft" && !this.m_bisOn)
		{
			this.m_bisOn = true;
			Tools.changeSprite(this, "gobj_trigger_1.png");
			cc.log("Open Mid left Door");
			g_sharedGameplayLyr.processMetalDoor("OpenMidLeft");
		}

		else if(this.m_currentFunc == "OpenMidRight" && !this.m_bisOn)
		{
			this.m_bisOn = true;
			Tools.changeSprite(this, "gobj_trigger_1.png");
			cc.log("Open Mid right Door");
			g_sharedGameplayLyr.processMetalDoor("OpenMidRight");
		}

	},

	collideRect:function(x, y)
	{
		var w = this.getContentSize().width;
		var h = this.getContentSize().height;

		return cc.rect(x - (w / 2), y - (h / 2), w, h);
	},

	update:function(dt)
	{
		if(this.m_bisOn)
		{
			if(this.m_timer < this.m_timeInterval)
			{
				this.m_timer += dt;

				if(this.m_timer >= this.m_timeInterval)
				{
					this.m_timer = 0;
					this.m_bisOn = false;
					Tools.changeSprite(this, "gobj_trigger_0.png");
				}
			}
		}	
	}
	


});

var MetalDoor = cc.Sprite.extend({

	m_tag:undefined,
	m_bIsOpen:undefined,
	act_open:undefined,
	act_close:undefined,
	m_timer:undefined,
	m_timeInterval:undefined,

	ctor:function(p_tag)
	{
		this._super("#gobj_barrier_0.png");
		this.init(p_tag);
	},

	init:function(p_tag)
	{
		this.m_tag = p_tag;
		this.m_bIsOpen = false;
		this.m_timer = 0;
		this.m_timeInterval = 5;
		this.act_open = new Tools.createFramesAnimation("gobj_barrier_", 0.01, 1, 2);
		this.act_close = new Tools.createFramesAnimation("gobj_barrier_", 0.01, 2, 0);
		this.scheduleUpdate();
	},

	openDoor:function()
	{
		if(!this.m_bIsOpen)
		{
			this.runAction(this.act_open);
			this.runAction(cc.sequence(cc.delayTime(0.02), 
			cc.callFunc(function()
			{
				this.setOpacity(0);
			}, this)));

			this.m_bIsOpen = true;
		}
	},

	closeDoor:function()
	{
		if(this.m_bIsOpen)
		{
			this.setOpacity(255);
			this.runAction(this.act_close);
			this.m_bIsOpen = false;
		}
	},

	collideRect:function(x, y)
	{
		var w = this.getContentSize().width;
		var h = this.getContentSize().height;

		//return cc.rect(x - (w / 2), y - (h / 2), w, h);
		return cc.rect(x - (w / 2), y - (h / 2), 0, 0);
	},

	update:function(dt)
	{
		if(this.m_bIsOpen)
		{
			if(this.m_timer < this.m_timeInterval)
			{
				this.m_timer += dt;

				if(this.m_timer >= this.m_timeInterval)
				{
					this.m_timer = 0;
					this.closeDoor();
				}
			}
		}
	}



});

