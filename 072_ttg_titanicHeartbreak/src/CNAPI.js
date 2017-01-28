function reload() {
    GC.RESTARTING = 1;
    
    if (GC.PAUSED) {
        resume();
    }
    
    var gameplayScene = new GameplayScene();
    cc.director.runScene(new cc.TransitionMoveInR(0.5, gameplayScene));
}

function pause() {
    // Disable controls
    GC.PAUSED = 1;
    
    cc.director.pause();
}

function resume() {
    // Enable controls
    GC.PAUSED = 0;
    
    cc.director.resume();
}

function mute() {
    GC.ENABLE_SFX = 0;
    
    cc.audioEngine.setMusicVolume(0.0);
    cc.audioEngine.setEffectsVolume(0.0);
}

function unmute() {
    GC.ENABLE_SFX = 1;
    
    cc.audioEngine.setMusicVolume(1.0);
    cc.audioEngine.setEffectsVolume(1.0);
}

function submitRank(rank) {
    if (rank >= GC.CN_RANK.NONE || rank <= GC.CN_RANK.OUTSTANDING) {
        location.href = "cnwap://userperform:" + rank;
    }
}

var mobile = false;

function onMobile(){
		mobile = true;
}