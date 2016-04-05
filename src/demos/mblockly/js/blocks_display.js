/**
 * @copyright 2015 Makeblock
 * @author callblueday
 * @description blocks for display
 */

goog.require('goog.color.hexToRgb');
goog.require('Blockly.Blocks');
goog.require('MBlockly.BlockKeeper');
goog.require('MBlockly.PianoInput');
goog.require('MBlockly.Control');


MBlockly.BlockKeeper.makeBlock('set_led_color', ['LED_POSITION', '=COLOUR1'], function(){
    var iconImages = MBlockly.resources().ICONS;
    var icon = new Blockly.FieldImage(iconImages.DISPLAY_LED_ALL, 30, 30, '*');

    this.setColour(MBlockly.BlockKeeper.HUE.display);
    var ledPositionList = new Blockly.FieldDropdown([
        [Blockly.Msg.DISPLAY_LED_ALL, 'BOTH'],
        [Blockly.Msg.DISPLAY_LED_LEFT, 'LEFT'],
        [Blockly.Msg.DISPLAY_LED_RIGHT, 'RIGHT']
    ], function() {
        var selected = event.target.textContent;
        if (selected == Blockly.Msg.DISPLAY_LED_LEFT) {
            icon.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
        'xlink:href', iconImages.DISPLAY_LED_LEFT);
        } else if (selected == Blockly.Msg.DISPLAY_LED_RIGHT) {
            icon.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
        'xlink:href', iconImages.DISPLAY_LED_RIGHT);
        } else {
            icon.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
        'xlink:href', iconImages.DISPLAY_LED_ALL);
        }
    });

    this.appendDummyInput()
        .appendField(icon)
        .appendField(Blockly.Msg.DISPLAY_LED_SET_LED_ON_BOARD)
        .appendField(ledPositionList, 'LED_POSITION')
        .appendField(Blockly.Msg.DISPLAY_LED_TO_COLOR);
        
    this.appendValueInput('COLOUR1')
        .setCheck('Colour')
        .setAlign(Blockly.ALIGN_RIGHT);

    this.setInputsInline(true);
    this.setOutput(false);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
}, function(ledPosition, color){        // code when this block is activated
    // strip string representation to normal ones
    var colorValue = color.data;
    if(colorValue.match(/^['"].*['"]$/)){
        colorValue = colorValue.substring(1, colorValue.length-1);
    }

    var colors = goog.color.hexToRgb(colorValue);
    MBlockly.Control.setLed(colors[0], colors[1], colors[2], MBlockly.Control.LedPosition[ledPosition]);
});

MBlockly.BlockKeeper.makeBlock('play_tone', ['TONE'], function(){
    var icon = new Blockly.FieldImage(MBlockly.resources().ICONS.DISPLAY_PLAY_TONE, 30, 30, '*');
    this.setColour(MBlockly.BlockKeeper.HUE.display);

    var pianoPanel = new MBlockly.PianoInput('C5');

    this.appendDummyInput()
        .appendField(icon)
        .appendField(Blockly.Msg.DISPLAY_PLAY_TONE_ON)
        .appendField(pianoPanel, 'TONE');

    this.setInputsInline(true);
    this.setOutput(false);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
}, function(tone){
    MBlockly.Control.playTone(tone.data);
});

MBlockly.BlockKeeper.makeBlock('stop_tone', [], function(){
    var icon = new Blockly.FieldImage(MBlockly.resources().ICONS.DISPLAY_STOP_TONE, 30, 30, '*');
    this.setColour(MBlockly.BlockKeeper.HUE.display);

    this.appendDummyInput()
        .appendField(icon)
        .appendField(Blockly.Msg.DISPLAY_STOP_TONE)
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
}, function(){
    MBlockly.Control.stopBuzzer();
});

MBlockly.BlockKeeper.makeBlock('play_song', ['TONG_SONG'], function(){
    var songList = MBlockly.Data.songList;
    var songName = [], songData = [];
    for(var i = 0; i < songList.length; i++) {
        var temp = [];
        temp.push(songList[i].name);
        temp.push('SONG_' + i);
        songName.push(temp);
    }

    var songDropDown = new Blockly.FieldDropdown(songName);

    this.setColour(MBlockly.BlockKeeper.HUE.display);
    this.appendDummyInput()
        .appendField(Blockly.Msg.DISPLAY_PLAY_SONG_AT)
        .appendField(songDropDown, 'TONG_SONG');
        
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
}, function(songName){
    var songList = MBlockly.Data.songList;
    var index = parseInt(songName.toString().split('_')[1]);
    MBlockly.Action.playSong(songList[index].data);
});