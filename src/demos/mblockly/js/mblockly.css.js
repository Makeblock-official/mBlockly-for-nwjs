/**
 * @copyright 2015 Makeblock
 * @author callblueday
 * @description override `src/core/css.js`, add clone function
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
