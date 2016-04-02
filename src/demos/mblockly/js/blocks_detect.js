goog.require('Blockly.Blocks');
goog.require('MBlockly.BlockKeeper');
goog.require('MBlockly.Control');

MBlockly.BlockKeeper.makeBlock('detect_ultrasonic', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.detect);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.DETECT_ULTRASONIC, 30, 30, '*'))
        .appendField(Blockly.Msg.DETECT_DISTANCE)
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(){
    var runtime = this;
    runtime.pause();
    var val = MBlockly.Control.getUltrasonicValue(function(){
        MBlockly.Control.out(val);
        runtime.resume();
    });
    return val;
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);

MBlockly.BlockKeeper.makeBlock('detect_ultrasonic_threshold', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.detect);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.START_OBSTACLE_DETECTED, 30, 30, '*'))
        .appendField(Blockly.Msg.DETECT_DISTANCE_THRESHOLD)
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(){
    var runtime = this;
    runtime.pause();
    var val = MBlockly.Control.getUltrasonicValue(function(){
        MBlockly.Control.out(val);
        runtime.resume();
    });
    var wrapper = {
        toString: function(){
            if(this.val < 30){
                return '1';
            }
            else{
                return '0';  // in javascript 'false' == true!
            }
        }
    };
    wrapper.val = val;
    return wrapper;
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);


MBlockly.BlockKeeper.makeBlock('detect_lightness', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.detect);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.DETECT_BRIGHTNESS, 30, 30, '*'))
        .appendField(Blockly.Msg.DETECT_LIGHTNESS);
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(){
    var runtime = this;
    runtime.pause();
    var val = MBlockly.Control.getLightSensorValue(function(){
        MBlockly.Control.out(val);
        runtime.resume();
    });
    return val;
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);

MBlockly.BlockKeeper.makeBlock('detect_lightness_threshold', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.detect);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.START_RECEIVE_LIGHT, 30, 30, '*'))
        .appendField(Blockly.Msg.DETECT_LIGHTNESS_THRESHOLD);
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(){
    var runtime = this;
    runtime.pause();
    var val = MBlockly.Control.getLightSensorValue(function(){
        runtime.resume();
    });
    var wrapper = {
        toString: function(){
            if(this.val > 60){
                return '1';
            }
            else{
                return '0';  // in javascript 'false' == true!
            }
        }
    };
    wrapper.val = val;
    return wrapper;
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);