goog.require('Blockly.Blocks');
goog.require('MBlockly.BlockKeeper');
goog.require('MBlockly.Control');


MBlockly.BlockKeeper.makeBlock('when_shake', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.start);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.START_TABLET_SHAKE, 32, 32, '*'))
        .appendField(Blockly.Msg.EVENT_WHEN_SHAKE);
    this.setInputsInline(true);
    this.setNextStatement(true);
}, function(){ });

MBlockly.BlockKeeper.makeBlock('tablet_shaked', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.event);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.EVENT_TABLET_SHAKE, 32, 32, '*'))
        .appendField(Blockly.Msg.EVENT_SHAKE);
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(){
    var time = (new Date()).getTime() / 1000;
    // 如果当前时间距离上次iPad摇晃的时间小于1秒
    if(time-MBlockly.Control.tabletLastShakeTime < 1){
        return true;
    }
    else{
        return false;
    }
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);

MBlockly.BlockKeeper.makeBlock('when_obstacle_ahead', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.start);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.START_OBSTACLE_DETECTED, 30, 30, '*'))
        .appendField(Blockly.Msg.EVENT_WHEN_OBSTACLE_AHEAD);
    this.setInputsInline(true);
    this.setNextStatement(true);
}, function(){ });

MBlockly.BlockKeeper.makeBlock('when_receieve_light', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.start);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.START_RECEIVE_LIGHT, 30, 30, '*'))
        .appendField(Blockly.Msg.EVENT_WHEN_RECEIVE_LIGHT);
    this.setInputsInline(true);
    this.setNextStatement(true);
}, function(){ });

MBlockly.BlockKeeper.makeBlock('when_button_on_top_pressed', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.start);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.START_BUTTON, 30, 30, '*'))
        .appendField(Blockly.Msg.EVENT_WHEN_BUTTON_ON_TOP_PRESSED);
    this.setInputsInline(true);
    this.setNextStatement(true);
}, function(){ });

MBlockly.BlockKeeper.makeBlock('tablet_tilt_forward', ['VALUE'], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.event);

    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.EVENT_TILT_FORWARD, 30, 30, '*'))
        .appendField(Blockly.Msg.DETECT_LINEFOLLOWER);
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(checkType){
    return (MBlockly.Control.tabletTiltLeftRightStatus == -1)
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);

MBlockly.BlockKeeper.makeBlock('tablet_tilt_left', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.event);

    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.EVENT_TILT_LEFT, 32, 32, '*'))
        .appendField(Blockly.Msg.EVENT_TABLET_TILT_LEFT);
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(checkType){
    return (MBlockly.Control.tabletTiltLeftRightStatus == -1)
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);

MBlockly.BlockKeeper.makeBlock('tablet_tilt_right', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.event);

    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.EVENT_TILT_RIGHT, 32, 32, '*'))
        .appendField(Blockly.Msg.EVENT_TABLET_TILT_RIGHT);
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(checkType){
    return (MBlockly.Control.tabletTiltLeftRightStatus == 1);
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);

MBlockly.BlockKeeper.makeBlock('tablet_tilt_forward', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.event);

    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.EVENT_TILT_FORWARD, 32, 32, '*'))
        .appendField(Blockly.Msg.EVENT_TABLET_TILT_FORWARD);
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(checkType){
    return (MBlockly.Control.tabletTiltForwardBackwardStatus == 1);
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);

MBlockly.BlockKeeper.makeBlock('tablet_tilt_backward', [], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.event);

    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.EVENT_TILT_BACKWARD, 32, 32, '*'))
        .appendField(Blockly.Msg.EVENT_TABLET_TILT_BACKWARD);
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(checkType){
    return (MBlockly.Control.tabletTiltForwardBackwardStatus == -1);
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);

MBlockly.BlockKeeper.makeBlock('linefollower_reads', ['VALUE'], function(){
    this.setColour(MBlockly.BlockKeeper.HUE.event);
     var dropdown = new Blockly.FieldDropdown([
         ['■■', 'BLACK_BLACK'],
         ['■□', 'BLACK_WHITE'],
         ['□■', 'WHITE_BLACK'],
         ['□□', 'WHITE_WHITE']
    ]);

    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(MBlockly.resources().ICONS.EVENT_LINE_FOLLOWER, 30, 30, '*'))
        .appendField(Blockly.Msg.EVENT_LINEFOLLOWER)
        .appendField(dropdown, 'VALUE');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setNextStatement(false);
    this.setPreviousStatement(false);
}, function(checkType){
    // value.data = BLACK_BLACK
    var runtime = this;
    runtime.pause();
    var val = MBlockly.Control.getLineFollowValue(function(){
        runtime.resume();
    });
    var wrapper = {
        toString: function(){
            if(this.val==MBlockly.Control.LINEFOLLOWER_VALUE[this.checkType]){
                return '1';
            }
            else{
                return '0';  // in javascript 'false' == true!
            }
        }
    };
    wrapper.val = val;
    wrapper.checkType = checkType;
    return wrapper;
}, Blockly.JavaScript.ORDER_FUNCTION_CALL);