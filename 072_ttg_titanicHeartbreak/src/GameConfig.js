var GC = GC || {};

// Debug
// 0: Turn debug off
// 1: Turn debug on
GC.DEBUG = {
    SWITCH:0,
    GOD_MODE:0
};

// Pause
GC.PAUSED = 0;
GC.RESTARTING = 0;

// Volume
GC.ENABLE_SFX = 1;

// How To Play
GC.HOW_TO_PLAY_PAGE = {
    ONE:1,
    TWO:2,
    COUNT:2
};

// Screen
GC.SCREEN = {
    SIZE:{
        WIDTH:1366,
        HEIGHT:768
    },
    CENTER:{
        X:683,
        Y:384
    }
};

// Game over screen
GC.GAME_OVER_ASSETS = {
    HIGH: {
        X:335,
        Y:80
    },
    YOUR: {
        X:335,
        Y:-97
    },
    REPLAY: {
        X:315,
        Y:-220
    }
};

GC.CHARACTER_NAME = {

    BEAST:0,
    CYBORG:1,
    RAVEN:2
};

GC.CURRENT_CHARACTER = GC.CHARACTER_NAME.BEAST;


GC.SWIPE_THRESHOLD = 50;

GC.LEVEL = 1;
// Score
GC.SCORE = 0;
GC.UNIQUE_SCORE_KEY = "cnsuwys_high_score"; // Note: Change this for other games!