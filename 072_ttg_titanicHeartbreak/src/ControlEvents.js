//Create a "one by one" touch event listener (processes one touch at a time)
var DraggingListener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    // When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
    swallowTouches: true,
    //onTouchBegan event callback function
    onTouchBegan: function (touch, event) {
        // event.getCurrentTarget() returns the *listener's* sceneGraphPriority node.
        var target = event.getCurrentTarget();

        //Get the position of the current point relative to the button
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        //Check the click area
        if (cc.rectContainsPoint(rect, locationInNode)) {
            cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
            target.opacity = 180;
            return true;
        }
        return false;
    },
    //Trigger when moving touch
    onTouchMoved: function (touch, event) {
        //Move the position of current button sprite
        var target = event.getCurrentTarget();
        var delta = touch.getDelta();
        target.x += delta.x;
        target.y += delta.y;
    },
    //Process the touch end event
    onTouchEnded: function (touch, event) {
        var target = event.getCurrentTarget();
        cc.log("sprite onTouchesEnded.. ");
        target.setOpacity(255);
    }
});

//Swipe left / Right / Up / Down
var GestureListener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ALL_AT_ONCE,
    
    // When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
    swallowTouches: true,
    
    onTouchesBegan: function(touches, event) {
    
        var touch = touches[0];
        var loc = touch.getLocation();

        self.touchStartPoint = {
            x: loc.x,
            y: loc.y
        };

        self.touchLastPoint = {
            x: loc.x,
            y: loc.y
        };
    },

    onTouchesMoved: function(touches, event) {
        
        var touch = touches[0];
        var loc = touch.getLocation(),
            start = self.touchStartPoint;


        if(loc.x < GC.SCREEN.CENTER.X)
        {
            // check for left
            if( loc.x < start.x - GC.SWIPE_THRESHOLD ) {
                // if direction changed while swiping left, set new base point
                if(g_sharedGameplayLyr.m_isStartGame)
                {
                    g_sharedGameplayLyr.m_player.triggerMovement(-1, true);
                }
                if( loc.x > self.touchLastPoint.x ) {
                    start = self.touchStartPoint = {
                        x: loc.x,
                        y: loc.y
                    };
                    self.isSwipeLeft = false;
                    //g_sharedGameplayLyr.m_player.triggerMovement(1, false);
                } else {
                    self.isSwipeLeft = true;
                }
            }

            // check for right
            if( loc.x > start.x + GC.SWIPE_THRESHOLD ) {
                // if direction changed while swiping right, set new base point
                if(g_sharedGameplayLyr.m_isStartGame)
                {
                    g_sharedGameplayLyr.m_player.triggerMovement(1, true);
                }
                if( loc.x < self.touchLastPoint.x ) {
                    self.touchStartPoint = {
                        x: loc.x,
                        y: loc.y
                    };
                    self.isSwipeRight = false;
                    //g_sharedGameplayLyr.m_player.triggerMovement(-1, false);
                } else {
                    self.isSwipeRight = true;
                }
            }

            // check for down
            if( loc.y < start.y - GC.SWIPE_THRESHOLD ) {
                // if direction changed while swiping down, set new base point
                if( loc.y > self.touchLastPoint.y ) {
                    self.touchStartPoint = {
                        x: loc.x,
                        y: loc.y
                    };
                    self.isSwipeDown = false;
                } else {
                    self.isSwipeDown = true;
                }
            }

            // check for up
            if( loc.y > start.y + GC.SWIPE_THRESHOLD ) {
                // if direction changed while swiping right, set new base point
                if( loc.y < self.touchLastPoint.y ) {
                    self.touchStartPoint = {
                        x: loc.x,
                        y: loc.y
                    };
                    self.isSwipeUp = false;
                } else {
                    self.isSwipeUp = true;
                }
            }
        }

        self.touchLastPoint = {
                x: loc.x,
                y: loc.y
        };
    },

    onTouchesEnded: function(touches, event){


        var target = event.getCurrentTarget();
        var touch = touches[0],
            loc = touch.getLocation();
        //var size = self.size;

        self.touchStartPoint = null;
        g_sharedGameplayLyr.m_player.triggerMovement(1, false);
        if(g_sharedGameplayLyr.m_player.m_isAnimWalk && !g_sharedGameplayLyr.m_player.m_isMoving)
        {
            var dir = g_sharedGameplayLyr.m_player.m_isFacingLeft;
            g_sharedGameplayLyr.m_player.playIdle(dir);
            g_sharedGameplayLyr.m_player.m_isAnimWalk = false;
        }
        if( !self.isSwipeUp && !self.isSwipeLeft && !self.isSwipeRight && !self.isSwipeDown ) {
            if( loc.y > GC.SCREEN.SIZE.HEIGHT*0.25 && loc.y < GC.SCREEN.SIZE.HEIGHT*0.75 ) {
                if(loc.x <GC.SCREEN.SIZE.WIDTH*0.50)
                {
                    self.isTouchLeft = true;
                }
                else
                {
                    self.isTouchRight = true;
                }
            } else if( loc.y > GC.SCREEN.SIZE.HEIGHT*0.75 ) {
                self.isTouchUp = true;
            } else {
                self.isTouchDown = true;
            }
        }
        self.isSwipeUp = self.isSwipeLeft = self.isSwipeRight = self.isSwipeDown = false;
    }
});

var KeyListener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ALL_AT_ONCE,
    // TODO: For testing only.
    onKeyReleased: function(key, event){
        // TODO: For testing only. Disable this on launch
        if (key == cc.KEY.r) {
            cc.log("Reload");
            reload();
        } 
        //temp
        else if(key == cc.KEY.g) {
            if(g_sharedGameplayLyr.m_isStartGame)
            {
                g_sharedGameplayLyr.m_player.playShoot();
            }
        } 

        else if (key == cc.KEY.space) {
            if (GC.PAUSED) {
                cc.log("Resume");
                resume();
            } else {
                cc.log("Pause");
                pause();
            }
        } else if (key == cc.KEY.m) {
            if (GC.ENABLE_SFX) {
                cc.log("Mute");
                mute();
            } else {
                cc.log("Unmute");
                unmute();
            }
        }   
    }
});