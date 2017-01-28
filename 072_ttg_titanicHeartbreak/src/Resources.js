var res = {


	titleScreen_png:     "res/titleScreen/titleScreen_0.png",
	ui_png:              "res/ui/ui.png",
	ui_plist:            "res/ui/ui.plist",

	//char
	char_beastboyUpper_plist:  "res/char/beast/char_beastboyUpper.plist",
	char_beastboyUpper_png:    "res/char/beast/char_beastboyUpper.png",
	char_beastboyLower_plist:  "res/char/beast/char_beastboyLower.plist",
	char_beastboyLower_png:    "res/char/beast/char_beastboyLower.png",
	char_ravenUpper_plist:     "res/char/raven/char_ravenUpper.plist",
	char_ravenUpper_png:       "res/char/raven/char_ravenUpper.png",
	char_ravenLower_plist:    "res/char/raven/char_ravenLower.plist",
	char_ravenLower_png:      "res/char/raven/char_ravenLower.png",
	char_cyborgUpperL_plist:  "res/char/cyborg/char_cyborgUpperL.plist",
	char_cyborgUpperL_png:    "res/char/cyborg/char_cyborgUpperL.png",
	char_cyborgUpperR_plist:  "res/char/cyborg/char_cyborgUpperR.plist",
	char_cyborgUpperR_png:    "res/char/cyborg/char_cyborgUpperR.png",
	char_cyborgLower_plist:   "res/char/cyborg/char_cyborgLower.plist",
	char_cyborgLower_png:     "res/char/cyborg/char_cyborgLower.png",
	preGame_robin_png:        "res/anim/anim_robinFloat.png",

	//fx
	fx_plist:            "res/fx/fx.plist",
	fx_png:              "res/fx/fx.png",

	//loadingScreen   
	loadingScreen_plist: "res/gameScreen/loadingScreen.plist",
	loadingScreen_png:   "res/gameScreen/loadingScreen.png",
	//gameScreenBG
	gameScreen_bg_png_1: "res/gameScreen/gameScreen_bg1.png",
	gameScreen_bg_png_2: "res/gameScreen/gameScreen_bg2.png",
	gameScreen_bg_png_3: "res/gameScreen/gameScreen_bg3.png",
	gameScreen_bg_png_4: "res/gameScreen/gameScreen_bg4.png",
	gameScreen_bg_png_5: "res/gameScreen/gameScreen_bg5.png",
	gameScreen_bg_png_6: "res/gameScreen/gameScreen_bg6.png",
	gameScreen_bg_png_7: "res/gameScreen/gameScreen_bg7.png",

	gameScreen_brick_png:    "res/gameScreen/gameScreen.png",
	gameScreen_brick_plist:  "res/gameScreen/gameScreen.plist",
	gameScreen_customCol_png: "res/gameScreen/colliders.png",
	gameScreen_customCol_plist: "res/gameScreen/colliders.plist",

	//endScreen
	endScreen_lose_png:   "res/endScreen/tryAgain/endScreen_Score_Lose.png",
	endScreen_bg_png:     "res/endScreen/panel2/endScreen_bg.png",

	//Select Level Screen
	levelSelect_bg_png:  "res/gameScreen/lvlSel_background.png",
	levelSelect_top_png:     "res/gameScreen/lvlSel_top.png",
	levelSelect_panel_png:   "res/gameScreen/lvlSel_bottom.png",
	levelSelect_char_plist:  "res/gameScreen/lvlSel_char.plist",
	levelSelect_char_png:  "res/gameScreen/lvlSel_char.png",

	//tutorial
	tutorialScreen_png:  "res/tutorial/Tutorial.png",
	tutorialScreen2_png: "res/tutorial/Tutorial_1.png",

	gobj_png:            "res/gobj/gobj.png",
	gobj_plist:          "res/gobj/gobj.plist",
	
	//font
	level1_fnt:          "res/font/@level1.fnt",
	level1_png:          "res/font/@level1.png",
	level2_fnt:          "res/font/@level2.fnt",
	level2_png:          "res/font/@level2.png",
	text1_fnt:           "res/font/@text1.fnt",
	text1_png:           "res/font/@text1.png",

    font_png:            "res/font.png",
    font_fnt:            "res/font.fnt",

    temp_obj:            "res/temp_obj.png",
    temp_button:         "res/temp_button.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}