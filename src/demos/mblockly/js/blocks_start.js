goog.require('goog.color.hexToRgb');
goog.require('Blockly.Blocks');
goog.require('MBlockly.BlockKeeper');
goog.require('MBlockly.Control');


MBlockly.BlockKeeper.makeBlock('start_whengo', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.start);
    this.appendDummyInput().appendField(Blockly.Msg.START_WHEN_GO)
    this.setInputsInline(true);
    this.setNextStatement(true);
}, function(){ });


Blockly.Blocks['start_whenif'] = {
  init: function(){
    this.jsonInit({
      "message0": Blockly.Msg.START_WHEN_IF,
      "args0": [
        {
          "type": "input_value",
          "name": "WHEN",
          "check": "Boolean"
        }
      ],
      "previousStatement": null,
      "nextStatement": true,
      "colour": MBlockly.BlockKeeper.HUE.start,
      "tooltip": '',
      "helpUrl": ''
    });
    this.appendStatementInput('DO')
        .appendField(Blockly.Msg.CONTROLS_REPEAT_INPUT_DO);
    this.setPreviousStatement(false);
  }
}

Blockly.JavaScript['start_whenif'] = function(block){
    var branch = Blockly.JavaScript.statementToCode(block, 'DO');
    var argument = Blockly.JavaScript.valueToCode(block, 'WHEN',
      Blockly.JavaScript.ORDER_NONE) || 'false';
    var code = "if ("+argument+") {\n"+branch+"\n}\n";
    return code;
}