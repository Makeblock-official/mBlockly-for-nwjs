/**
 * @copyright 2015 Makeblock
 * @author callblueday
 * @description override `src/core/flyout.js`
 */

/**
 * override /src/core/flyout.js
 * change contentTop from -25 to 0
 */
Blockly.Flyout.prototype.getMetrics_ = function() {
  if (!this.isVisible()) {
    // Flyout is hidden.
    return null;
  }
  var viewHeight = this.height_ - 2 * this.CORNER_RADIUS;
  var viewWidth = this.width_;
  try {
    var optionBox = this.workspace_.getCanvas().getBBox();
  } catch (e) {
    // Firefox has trouble with hidden elements (Bug 528969).
    var optionBox = {height: 0, y: 0};
  }
  return {
    viewHeight: viewHeight,
    viewWidth: viewWidth,
    contentHeight: optionBox.height + optionBox.y,
    viewTop: -this.workspace_.scrollY,
    contentTop: 0,
    absoluteTop: this.CORNER_RADIUS,
    absoluteLeft: 0
  };
};

