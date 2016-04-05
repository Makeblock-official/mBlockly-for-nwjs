/**
 * @copyright 2015 Makeblock
 * @author callblueday
 * @description override `src/core/block.js`
 */

'use strict';

goog.require('Blockly.Block');

/**
 * Duplicate this block and its children.
 * @return {!Blockly.Block} The duplicate.
 * @private
 */
Blockly.Block.prototype.duplicateBelow_ = function() {
  // Create a duplicate via XML.
  var xmlBlock = Blockly.Xml.blockToDom_(this);
  // Blockly.Xml.deleteNext(xmlBlock);
  var newBlock = Blockly.Xml.domToBlock(
      /** @type {!Blockly.Workspace} */ (this.workspace), xmlBlock);
  // Move the duplicate next to the old block.
  var xy = this.getRelativeToSurfaceXY();
  if (this.RTL) {
    xy.x -= Blockly.SNAP_RADIUS;
  } else {
    xy.x += Blockly.SNAP_RADIUS;
  }
  xy.y += Blockly.SNAP_RADIUS * 2;
  newBlock.moveBy(xy.x, xy.y);
  newBlock.select();
  return newBlock;
};