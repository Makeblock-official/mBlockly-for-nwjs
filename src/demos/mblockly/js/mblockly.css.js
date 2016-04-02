/**
 * Copyright 2015 Makeblock
 * Author: callblueday
 * Description: add and modify context menu.
 * 
 */

'use strict';

goog.provide('MBlockly.Css');

goog.require('Blockly.Css');


MBlockly.Css = function() {
  MBlockly.Css.superClass_.constructor.call(this, text);
};
goog.inherits(MBlockly.Css, Blockly.Css);


MBlockly.Css.prototype.clone = function() {
  return new MBlockly.Css(this.getText(), this.changeHandler_);
};
