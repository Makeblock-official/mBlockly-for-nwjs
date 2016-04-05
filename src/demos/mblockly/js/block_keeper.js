/**
 * @copyright 2015 Makeblock
 * @author Wang Yu
 * @description BlockKeeper provides an unified interface for adding blocks to Blockly system
 * @example
 * 
 *     MBlockly.BlockKeeper.makeBlock('set_led_color', ['LED_POSITION', '*COLOUR1'], function(){
 *     // block ui builder
 *     this.appendDummyInput()
            .appendField(Blockly.Msg.DISPLAY_LED_SET_LED_ON_BOARD)
            .appendField(ledPositionList, 'LED_POSITION')
            .appendField(Blockly.Msg.DISPLAY_LED_TO_COLOR);
            ......
 *     }, function(led_position, colour1){
 *         // code to run when block is activated
 *     })
 */

'use strict';
goog.provide('MBlockly.BlockKeeper');

goog.require('Blockly.Blocks');

MBlockly.BlockKeeper = {
    HUE: {
        start: 200,
        move: 218,
        display: 250,
        event: 40,
        detect: 18,
        math: 289,
        control: 330
    },
    blockList : {},
    getBlocks : function(){
        return this.blockList;
    }, 

    /**
     * Register a block into MBlockly system; add a function to javascript parser;
     * when block is executed, call that added function.
     *  
     * @param  {string} blockName - name of the block in xml description
     * @param  {[string]} argList   - list of argument this block takes
     * @param  {function} uiBuilder - a function for building the block
     * @param  {function} handler   - show what is done when the block is run
     * @param  {enum} opOrder   - the operation order of this block
     * @return {void}           
     *
     * opOrder types - if you omit this argument, it will generate a normal block;
     * otherwise a valued block. Possible values:
     * Blockly.JavaScript.ORDER_ATOMIC
     * Blockly.JavaScript.ORDER_ADDITION
     * Blockly.JavaScript.ORDER_SUBTRACTION
     * Blockly.JavaScript.ORDER_MULTIPLICATION
     * Blockly.JavaScript.ORDER_DIVISION
     * Blockly.JavaScript.ORDER_COMMA
     * Blockly.JavaScript.ORDER_FUNCTION_CALL
     * Blockly.JavaScript.ORDER_UNARY_NEGATION
     * Blockly.JavaScript.ORDER_NONE
     */
    makeBlock : function(blockName, argList, uiBuilder, handler, opOrder){
        Blockly.Blocks[blockName] = {
            init: uiBuilder
        };
        Blockly.JavaScript[blockName] = function(block){
            var argValues = [];
            for(var i=0;i<argList.length;i++){
                if(argList[i].charAt(0) == '*'){
                    var codeForm = Blockly.JavaScript.valueToCode(block, argList[i].substring(1), Blockly.JavaScript.ORDER_COMMA);
                    argValues.push(codeForm.substring(1, codeForm.length-1));
                } else if(argList[i].charAt(0) == '='){
                    var codeForm = Blockly.JavaScript.valueToCode(block, argList[i].substring(1), Blockly.JavaScript.ORDER_COMMA);
                    argValues.push(codeForm);
                }
                else{
                    argValues.push(block.getFieldValue(argList[i]));
                }
            }
            var argStr = '"'+argValues.join('","')+'"';
            if(argStr == '""'){
                argStr = '';
            }
            var code = 'blockly_js_func_'+blockName+'('+argStr+')';
            if(opOrder){    // this is a value block, output a value tuple;
                code = [code, opOrder];
            }
            else{   // this is a normal block, output a line of code
                code += ';\n';
            }
            return code;
        } 
        this.blockList[blockName] = {
            'argList': argList,
            'handler': handler, 
            'funcName': 'blockly_js_func_'+blockName
        };
    }
}