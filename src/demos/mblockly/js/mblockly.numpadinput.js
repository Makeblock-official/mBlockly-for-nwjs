/**
 * Copyright 2015 Makeblock
 * Author: Wangyu
 * Description: provide an slider interface
 * to input numbers between 0-255;
 * 
 */

'use strict';

goog.provide('MBlockly.NumpadInput');

goog.require('Blockly.Blocks');
goog.require('goog.ui.Dialog')
goog.require('goog.ui.Slider');

MBlockly.NumpadInput = function(text, opt_changeHandler) {
  MBlockly.NumpadInput.superClass_.constructor.call(this, text);
  this.setChangeHandler(opt_changeHandler);
};
goog.inherits(MBlockly.NumpadInput, Blockly.FieldTextInput);

/**
 * Clone this FieldTextInput.
 * @return {!Blockly.FieldTextInput} The result of calling the constructor again
 *   with the current values of the arguments used during construction.
 */
MBlockly.NumpadInput.prototype.clone = function() {
  return new MBlockly.NumpadInput(this.getText(), this.changeHandler_);
};

Blockly.Blocks['math_number'] = {
  /**
   * Block for numeric value.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.MATH_NUMBER_HELPURL);
    this.setColour(Blockly.Blocks.math.HUE);
    this.appendDummyInput()
        .appendField(new MBlockly.NumpadInput('0',
        Blockly.FieldTextInput.numberValidator), 'NUM');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

MBlockly.NumpadInput.prototype.showEditor_ = function(opt_quietInput) {
    // this is mostly copied from google library;
    // not a really good practice, but clean.
  var quietInput = opt_quietInput || false;
  if (!quietInput && (goog.userAgent.MOBILE || goog.userAgent.ANDROID ||
                      goog.userAgent.IPAD)) {
    var self = this;
    var sliderRange = self.sliderMax - self.sliderMin;
    var dialog1 = new goog.ui.Dialog();
    // construct buttons
    var numpad_buttons = ['1', '2', '3',
                          '4', '5', '6',
                          '7', '8', '9',
                          '-', '0', '='];
    var html_buttons = '<div class="numpad-buttons">';
    for(var i=0;i<numpad_buttons.length;i++){
      var btn = numpad_buttons[i];
      if (btn == 'x'){
        html_buttons += '<button class="numpad-button" id="numpad-button-cancel">=</button>';
      }
      else if (btn == '='){
        html_buttons += '<button class="numpad-button" id="numpad-button-ok">=</button>';
      }
      else if (btn == '-'){
        html_buttons += '<button class="numpad-button" id="numpad-button-minus">-</button>';
      }
      else if (btn == 'c'){
        html_buttons += '<button id="numpad-backspace">C</button>';
      }
      else{
        html_buttons += '<button class="numpad-button numpad-button-numeric">'+btn+'</button>';
      }
    }
    html_buttons += '</div>';
    var html_display = '<div class="numpad-display-section"><div class="numpad-display-container">'+
                      '<span id="numpad-display">0</span></div>'+
                      '<button id="numpad-backspace">C</button></div>'

    dialog1.setContent('<div id="numpad">'+html_display+html_buttons+'</div>');
    dialog1.setVisible(true);
    dialog1.setDisposeOnHide(true);
    $('.modal-dialog-buttons').hide();

    // all dom operations below this line!
    // $('#numpad-display').text(this.text_);
    $('#numpad-display').text(0);
    // set button events
    // 
    var eventType = MBlockly.App.checkDeviceType();
    $('.numpad-button-numeric').on(eventType, function(){
      var originalText = $('#numpad-display').text();
      if(originalText.length > 4){
        return;
      }
      if(originalText=='0'){
        originalText = '';
      }
      $('#numpad-display').text(''.concat(originalText).concat($(this).text()));
      self.setText(Number($('#numpad-display').text()));
    });
    $('#numpad-backspace').on(eventType, function(){
      $('#numpad-display').text('0');
      self.setText(Number($('#numpad-display').text()));
    });
    $('#numpad-button-minus').on(eventType, function(){
      var originalText = Number($('#numpad-display').text());
      var newText = -originalText
      if(originalText=='0'){
        newText = '-';
      }
      $('#numpad-display').text(newText);
      if(originalText!='0'){
        self.setText(Number($('#numpad-display').text()));
      }
    });
    $('#numpad-button-ok').on(eventType, function(){
      var originalText = $('#numpad-display').text();
      if(originalText=='-'){
        $('#numpad-display').text('0');
      }
      self.setText(Number($('#numpad-display').text()));
      dialog1.setVisible(false);
    });

    $('.modal-dialog-title').hide();

    $('.modal-dialog-bg').off(eventType);
    $('.modal-dialog-bg').on(eventType, function(){
      dialog1.setVisible(false);
    });
    
    return;
  }

  Blockly.WidgetDiv.show(this, this.sourceBlock_.RTL, this.widgetDispose_());
  var div = Blockly.WidgetDiv.DIV;
  // Create the input.
  var htmlInput = goog.dom.createDom('input', 'blocklyHtmlInput');
  htmlInput.setAttribute('spellcheck', this.spellcheck_);
  Blockly.FieldTextInput.htmlInput_ = htmlInput;
  div.appendChild(htmlInput);

  htmlInput.value = htmlInput.defaultValue = this.text_;
  htmlInput.oldValue_ = null;
  this.validate_();
  this.resizeEditor_();
  if (!quietInput) {
    htmlInput.focus();
    htmlInput.select();
  }

  // Bind to keydown -- trap Enter without IME and Esc to hide.
  htmlInput.onKeyDownWrapper_ =
      Blockly.bindEvent_(htmlInput, 'keydown', this, this.onHtmlInputKeyDown_);
  // Bind to keyup -- trap Enter; resize after every keystroke.
  htmlInput.onKeyUpWrapper_ =
      Blockly.bindEvent_(htmlInput, 'keyup', this, this.onHtmlInputChange_);
  // Bind to keyPress -- repeatedly resize when holding down a key.
  htmlInput.onKeyPressWrapper_ =
      Blockly.bindEvent_(htmlInput, 'keypress', this, this.onHtmlInputChange_);
  var workspaceSvg = this.sourceBlock_.workspace.getCanvas();
  htmlInput.onWorkspaceChangeWrapper_ =
      Blockly.bindEvent_(workspaceSvg, 'blocklyWorkspaceChange', this,
      this.resizeEditor_);
};