var Brick = cc.Sprite.extend({

	ctor:function(texture)
	{
		this._super(texture);
	},

	collideRect:function(x, y)
	{
		var w = this.getContentSize().width;
		var h = this.getContentSize().height;

		return cc.rect(x - (w / 2), y - (h / 2), w, h);
	},

});
