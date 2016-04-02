/**
 * Copyright 2015 Makeblock
 * Author: Wangyu
 * Description: provide an slider interface
 * to input numbers between 0-255;
 * 
 */

'use strict';

goog.provide('MBlockly.PianoInput');
goog.provide('MBlockly.Control');

goog.require('Blockly.Blocks');
goog.require('goog.ui.Dialog')

MBlockly.PianoInput = function(text, opt_changeHandler) {
  MBlockly.PianoInput.superClass_.constructor.call(this, text);
};
goog.inherits(MBlockly.PianoInput, Blockly.FieldTextInput);

/**
 * Clone this FieldTextInput.
 * @return {!Blockly.FieldTextInput} The result of calling the constructor again
 *   with the current values of the arguments used during construction.
 */
MBlockly.PianoInput.prototype.clone = function() {
  return new MBlockly.PianoInput(this.getText(), this.changeHandler_);
};

Blockly.Blocks['text_music_note'] = {
  /**
   * Block for numeric value.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.MATH_NUMBER_HELPURL);
    this.appendDummyInput()
        .appendField(new MBlockly.PianoInput('0'), 'NUM');
    this.setOutput(true, 'MusicNote');
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

MBlockly.PianoInput.prototype.showEditor_ = function(opt_quietInput) {
    // this is mostly copied from google library;
    // not a really good practice, but clean.
  var quietInput = opt_quietInput || false;
  var self = this;

  // create a note list C2 ... D8
  var buildPianoArray = function(start, finish){
    var key = start;
    var keys = [];
    while(key != finish){
      keys.push(key);
      var noteCode = key.charCodeAt(0);
      var scaleCode = parseInt(key.charAt(1));
      noteCode++;
      if(noteCode > 'G'.charCodeAt(0)){
        noteCode = 'A'.charCodeAt(0);
      }
      if(noteCode == 'C'.charCodeAt(0)){
        scaleCode++;
      }
      key = String.fromCharCode(noteCode)+scaleCode;
    }
    return keys;
  }
  var notesList = buildPianoArray('C5', 'D6');

  var dialog1 = new goog.ui.Dialog();
  var htmlKeys = '<div id="piano-keys"><div class="piano-key-wrapper">';
  for(var i=0;i<notesList.length;i++){
    htmlKeys += '<div class="piano-key note-name-'+notesList[i]+'" note-name="'+notesList[i]+'">'+
                    '<label>'+notesList[i]+'</label>'+
                '</div>';
  }
  htmlKeys += '</div></div>';
  var htmlDisplay = '<div id="piano-display"></div>';
  var htmlActionButtons = '<div id="piano-action-buttons"><button id="piano-button-ok"></button></div>';

  dialog1.setContent('<div id="piano">'+htmlKeys+htmlDisplay+htmlActionButtons+'</div>');
  dialog1.setVisible(true);
  dialog1.setDisposeOnHide(true);
  $('.modal-dialog-buttons').hide();

  // all dom operations below this line!
  $('#piano-display').text(this.text_);
  $('#piano-keys').scrollLeft($('.piano-key-wrapper').width()/2-450);
  // set button events
  // 
  var eventType = MBlockly.App.checkDeviceType();
  $('.piano-key').on(eventType, function(){
    var noteName = $(this).attr('note-name');
    $('#piano-display').text(noteName);
    MBlockly.Control.playTone(noteName);
  });
  $('#piano-button-ok').on(eventType, function(){
    self.setText($('#piano-display').text())
    dialog1.setVisible(false);
  });

  $('.modal-dialog-bg').off(eventType);
  $('.modal-dialog-bg').on(eventType, function(){
    dialog1.setVisible(false);
  });

  $('.modal-dialog-title').hide();
};