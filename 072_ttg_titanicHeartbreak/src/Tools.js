var Tools = Tools || {};

Tools.random = function (min, max) {
	// Note: includes both min and max
	return Math.round(Math.random() * (max - min) + min);
};

Tools.changeSprite = function(target, tag) {
    target.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(tag));
};

Tools.createFramesAnimation = function (prefix, interval, start, end) {
	var frames = [];
		
	if (start < end) {
		for (var i = start; i <= end; i++) {
			var frame = cc.spriteFrameCache.getSpriteFrame(prefix + i + ".png");
			frames.push(frame);
		}
	} else {
		for (var i = start; i >= end; i--) {
			var frame = cc.spriteFrameCache.getSpriteFrame(prefix + i + ".png");
			frames.push(frame);
		}
	}
	
	return cc.animate(new cc.Animation(frames, interval));
};

Tools.circlesIntersect = function (obj1, obj2) {
    var distance = cc.pDist(ob1.getPosition(), ob2.getPosition());
	
    // NOTE: Create obj radius function that returns the object radius
    return distance < obj1.radius() + obj2.radius();
};

Tools.rectsIntersect = function (obj1, obj2) {
    // NOTE: Create obj rect function that returns the object collision box
    var aRect = obj1.collideRect();
    var bRect = obj2.collideRect();
    return cc.rectIntersectsRect(aRect, bRect);
};

Tools.createCollider = function (obj, width, height) {
	var collider = new cc.DrawNode();
	var origin = cc.p(0, 0);
	var destination = cc.p(width, height);
	collider.drawRect(origin, destination, cc.color(255, 255, 255, 64));
	return collider;
};