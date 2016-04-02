/**
 * Copyright 2015 Makeblock
 * Author: Wangyu
 * Description: provide an slider interface
 * to input numbers between 0-255;
 * 
 */

'use strict';

goog.provide('MBlockly.FieldColour');

goog.require('Blockly.Blocks');
goog.require('goog.ui.Dialog')
goog.require('goog.ui.Slider');

MBlockly.FieldColour = function(text, opt_changeHandler, opt_min, opt_max) {
  MBlockly.FieldColour.superClass_.constructor.call(this, text);
  this.setChangeHandler(opt_changeHandler);
};
goog.inherits(MBlockly.FieldColour, Blockly.FieldColour);

/**
 * Clone this FieldTextInput.
 * @return {!Blockly.FieldTextInput} The result of calling the constructor again
 *   with the current values of the arguments used during construction.
 */
MBlockly.FieldColour.prototype.clone = function() {
  return new MBlockly.FieldColour(this.getText(), this.changeHandler_);
};

Blockly.Blocks['colour_picker'] = {
  /**
   * Block for colour picker.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.COLOUR_PICKER_HELPURL);
    this.setColour(Blockly.Blocks.colour.HUE);
    this.appendDummyInput()
        .appendField(new MBlockly.FieldColour('#ff0000'), 'COLOUR');
    this.setOutput(true, 'Colour');
    this.setTooltip(Blockly.Msg.COLOUR_PICKER_TOOLTIP);
  }
};

// override showEditor_ function only in mobile devices
if (goog.userAgent.MOBILE || goog.userAgent.ANDROID ||
                      goog.userAgent.IPAD) {
  var dialog1 = new goog.ui.Dialog();
}

MBlockly.FieldColour.prototype.showEditor_ = function(opt_quietInput) {
    // this is mostly copied from google library;
    // not a really good practice, but clean.
  var quietInput = opt_quietInput || false;
  if (!quietInput && (goog.userAgent.MOBILE || goog.userAgent.ANDROID ||
                      goog.userAgent.IPAD)) {
    var self = this;
    var sliderRange = self.sliderMax - self.sliderMin;
    var dialog1 = new goog.ui.Dialog();
    dialog1.setContent('<div id="color-picker-box">'+
                          '<div id="color-picker-R">'+
                            '<label class="color-picker-label">'+Blockly.Msg.COLOUR_RGB_RED+'</label>'+
                            '<div id="color-slider-R" class="goog-slider">'+
                              '<div class="goog-slider-thumb"></div>'+
                            '</div>'+
                            '<div id="color-slider-display-R">100</div>'+
                          '</div>'+
                          '<div id="color-picker-G">'+
                            '<label class="color-picker-label">'+Blockly.Msg.COLOUR_RGB_GREEN+'</label>'+
                            '<div id="color-slider-G" class="goog-slider">'+
                              '<div class="goog-slider-thumb"></div>'+
                            '</div>'+
                            '<div id="color-slider-display-G">100</div>'+
                          '</div>'+
                          '<div id="color-picker-B">'+
                            '<label class="color-picker-label">'+Blockly.Msg.COLOUR_RGB_BLUE+'</label>'+
                            '<div id="color-slider-B" class="goog-slider">'+
                              '<div class="goog-slider-thumb"></div>'+
                            '</div>'+
                            '<div id="color-slider-display-B">100</div>'+
                          '</div>'+
                          '<div id="color-result-box"></div>'+
                          '<button id="color-dialog-ok"></button>'+
                          '<button id="color-dialog-cancel"></button>'+
                       '</div>');
    var sliderList = [{'id':'R'}, {'id':'G'}, {'id':'B'}];
    $('#power-slider-display').text(this.text_);
    dialog1.setVisible(true);
    dialog1.setDisposeOnHide(true);
    for(var i=0;i<sliderList.length;i++){
      var sliderItem = sliderList[i];
      var slider_el = document.getElementById('color-slider-'+sliderItem.id);
      var slider = new goog.ui.Slider;
      slider.decorate(slider_el);
      //TODO: slider.setValue(R/G/B)
      (function(s, sid){
        s.addEventListener(goog.ui.Component.EventType.CHANGE, function() {
          $('#color-slider-display-'+sid).text(parseInt(s.getValue()/100*255));
        });
      })(slider, sliderItem.id);
    }

    $('.modal-dialog-title').hide();
    goog.events.listen(dialog1, goog.ui.Dialog.EventType.SELECT, function(e) {
      if(e.key=='ok'){
        self.setText(parseInt(slider.getValue()/100*sliderRange+self.sliderMin));
      }
      $('#power-slider-box').remove();
    });


    // Mobile browsers have issues with in-line textareas (focus & keyboards).
    // var newValue = window.prompt(Blockly.Msg.CHANGE_VALUE_TITLE, this.text_);
    // if (this.sourceBlock_ && this.changeHandler_) {
    //   var override = this.changeHandler_(newValue);
    //   if (override !== undefined) {
    //     newValue = override;
    //   }
    // }
    // if (newValue !== null) {
    //   this.setText(newValue);
    // }
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