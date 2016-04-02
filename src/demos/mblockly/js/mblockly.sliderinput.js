/**
 * Copyright 2015 Makeblock
 * Author: Wangyu
 * Description: provide an slider interface
 * to input numbers between 0-255;
 * 
 */

'use strict';

goog.provide('MBlockly.FieldSliderInput');

goog.require('Blockly.Blocks');
goog.require('goog.ui.Dialog')
goog.require('goog.ui.Slider');

MBlockly.FieldSliderInput = function(text, opt_changeHandler, opt_min, opt_max) {
  this.sliderMin = opt_min ? Number(opt_min) : 0;
  this.sliderMax = opt_max ? Number(opt_max) : 255;
  MBlockly.FieldSliderInput.superClass_.constructor.call(this, text);
  this.setChangeHandler(opt_changeHandler);
};
goog.inherits(MBlockly.FieldSliderInput, Blockly.FieldTextInput);

/**
 * Clone this FieldTextInput.
 * @return {!Blockly.FieldTextInput} The result of calling the constructor again
 *   with the current values of the arguments used during construction.
 */
MBlockly.FieldSliderInput.prototype.clone = function() {
  return new MBlockly.FieldSliderInput(this.getText(), this.changeHandler_);
};

Blockly.Blocks['math_number_range'] = {
  /**
   * Block for numeric value.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.MATH_NUMBER_HELPURL);
    this.setColour(Blockly.Blocks.math.HUE);
    this.appendDummyInput()
        .appendField(new MBlockly.FieldSliderInput('0',
        Blockly.FieldTextInput.numberValidator, this.extra_attributes.min, this.extra_attributes.max), 'NUM');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Blockly.JavaScript['math_number_range'] = function(block) {
  // Numeric value.
  var code = parseFloat(block.getFieldValue('NUM'));
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
MBlockly.FieldSliderInput.sharedDialog = null;
MBlockly.FieldSliderInput.prototype.showEditor_ = function(opt_quietInput) {
    // this is mostly copied from google library;
    // not a really good practice, but clean.
  var quietInput = opt_quietInput || false;
  if (!quietInput && (goog.userAgent.MOBILE || goog.userAgent.ANDROID ||
                      goog.userAgent.IPAD)) {
    var self = this;
    var sliderRange = self.sliderMax - self.sliderMin;
    if(MBlockly.FieldSliderInput.sharedDialog === null){
        MBlockly.FieldSliderInput.sharedDialog = new goog.ui.Dialog();
    }
    var dialog1 = MBlockly.FieldSliderInput.sharedDialog;
    
    dialog1.setContent('<div id="power-slider-box">'+
            '<div id="power-slider" class="goog-slider"><div class="slider-thumb-shadow"></div><div class="goog-slider-thumb">'+
              '<div class="slider-thumb-inner"><div class="slider-line-set-1"></div>'+
              '<div class="slider-line-set-2"></div></div></div></div>'+
            '<div id="power-slider-display">100</div>'+
            '<div id="slider-very-slow-text" class="slider-label">'+Blockly.Msg.SLIDER_VERY_SLOW+'</div><div id="slider-very-slow-line" class="slider-vertical-line"></div>'+
            '<div id="slider-slow-text" class="slider-label">'+Blockly.Msg.SLIDER_SLOW+'</div><div id="slider-slow-line" class="slider-vertical-line"></div>'+
            '<div id="slider-medium-text" class="slider-label">'+Blockly.Msg.SLIDER_MEDIUM+'</div><div id="slider-medium-line" class="slider-vertical-line"></div>'+
            '<div id="slider-fast-text" class="slider-label">'+Blockly.Msg.SLIDER_FAST+'</div><div id="slider-fast-line" class="slider-vertical-line"></div>'+
            '<div id="slider-very-fast-text" class="slider-label">'+Blockly.Msg.SLIDER_VERY_FAST+'</div><div id="slider-very-fast-line" class="slider-vertical-line"></div>'+
            '<div id="slider-ok-button"></div>'+
        '</div>');
    $('#power-slider-display').text(this.text_);
    dialog1.setVisible(true);
    dialog1.setDisposeOnHide(true);
    var slider_el = document.getElementById('power-slider');
    var slider = new goog.ui.Slider;
    slider.decorate(slider_el);
    $('.modal-dialog-buttons').hide();

    // put ui code below this line
    // 
    var fixSliderShadow = function(){
      $('.slider-thumb-shadow').width($('.goog-slider-thumb').position().left);
    };
    slider.setValue(new Number((this.text_-self.sliderMin)/sliderRange*100));
    $('#power-slider-display').text(this.text_);
    fixSliderShadow();
    slider.addEventListener(goog.ui.Component.EventType.CHANGE, function() {
        $('#power-slider-display').text(parseInt(slider.getValue()/100*sliderRange+self.sliderMin));
        fixSliderShadow();
    });

    $('.modal-dialog-title').hide();
    var eventType = MBlockly.App.checkDeviceType();
    $('#slider-ok-button').on(eventType, function(){
      self.setText(parseInt(slider.getValue()/100*sliderRange+self.sliderMin));
      $('#power-slider-box').remove();
      dialog1.setVisible(false);
    });

    $('.modal-dialog-bg').off(eventType);
    $('.modal-dialog-bg').on(eventType, function(){
      $('#power-slider-box').remove();
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