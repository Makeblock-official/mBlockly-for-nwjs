/**
 * @copyright 2015 Makeblock
 * @author Wang Yu (wangyu@makeblock.cc)
 * @description store runtime information and manage interpreter for MBlockly
 */

'use strict';
goog.provide('MBlockly.Runtime');

MBlockly.Runtime = function(workspace) {
    this.onFinish = null;
    this.workspace = workspace;
    this.highlightPause = false;
    this.stepTimer = null;
    this.isFinished = false;
    this.nextStepDelay = MBlockly.Runtime.IntervalBetweenSteps;
    this.topBlockID = 0;
};

// delay 1ms between blocks
MBlockly.Runtime.IntervalBetweenSteps = 1;

MBlockly.Runtime.run = function(workspace) {
    return MBlockly.Runtime.runFromBlock(workspace, null);
};

MBlockly.Runtime.runFromBlock = function(workspace, block) {
    var runtime = new MBlockly.Runtime(workspace);
    runtime.parseCode(block);
    runtime.step();
    return runtime;
};

MBlockly.Runtime.prototype.highlightBlock = function(id) {
    if(id != this.topBlockID) {
        this.workspace.highlightBlock(id);
    }
    this.highlightPause = true;
};

MBlockly.Runtime.prototype.print = function(msg) {
    document.getElementById('log').childNodes[0].nodeValue = msg;
};

MBlockly.Runtime.prototype.parseCode = function(startBlock) {
    // Generate JavaScript code and parse it.
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.JavaScript.addReservedWords('highlightBlock');

    var code;
    // if there is an "When go" block, execute it.
    var topBlocks = this.workspace.getTopBlocks();
    // if start block is undefined, search for 'start_whengo' block
    if(!startBlock) {
        for (var i=0; i<topBlocks.length; i++) {
          if(topBlocks[i].type == 'start_whengo') {
            startBlock = topBlocks[i];
            break;
          }
        }
    }
    if(startBlock) {
      Blockly.JavaScript.init(workspace);
      code = Blockly.JavaScript.blockToCode(startBlock);
      code = Blockly.JavaScript.finish(code);
    }
    else{
      code = Blockly.JavaScript.workspaceToCode(workspace);
    }
    this.topBlockID = startBlock ? startBlock.id : 0;

    code = code.split("window.alert").join("print");
    var array = code.split("\n");
    for (var i = 0; i < array.length; i++) {
        var c = array[i];
        if (c.indexOf("getSensorValue") > -1) {
            var split = "getSensorValue" + c.split("getSensorValue")[1].split(")")[0] + ")";
            var output = split + ";\n"+c.split(split).join("getResponseValue()") + "\n" ;
            code = code.split(c).join(output);
        }
    }
    this.interpreter = new Interpreter(code, this.initApi);
    this.interpreter.runtime = this;
    this.highlightPause = false;
    this.workspace.traceOn(true);
    this.workspace.highlightBlock(null);
}

MBlockly.Runtime.prototype.step = function() {
    var that = this;
    if(this.isPaused && !this.isFinished) {
        return;
    }
    try{
        if(this.interpreter.step()) {
            var delay = this.nextStepDelay;
            this.nextStepDelay = MBlockly.Runtime.IntervalBetweenSteps;
            this.stepTimer = setTimeout(function() {that.step()}, delay);
        }
        else{   // the program is done
            if(this.onFinish) {
                this.onFinish();
            }
        }
    }
    catch (err) {
        if(err == 'BleDisconnected') {
            this.onFinish();
        }
    }
}

MBlockly.Runtime.prototype.wait = function(time) {
    this.nextStepDelay = time * 1000;
}

MBlockly.Runtime.prototype.pause = function() {
    if(this.stepTimer) {
        clearTimeout(this.stepTimer);
    }
    this.isPaused = true;
}

MBlockly.Runtime.prototype.resume = function() {
    this.isPaused = false;
    this.step();
}

MBlockly.Runtime.prototype.stop = function() {
    this.pause();
    this.workspace.highlightBlock(null);
}

MBlockly.Runtime.prototype.stepCode = function() {
    this.step();
}

MBlockly.Runtime.prototype.initApi = function(interpreter, scope) {
    // Add an API function for the alert() block.
    var wrapper = function(text) {
        text = text ? text.toString() : '';
        return interpreter.createPrimitive(alert(text));
    };
    interpreter.setProperty(scope, 'alert',
        interpreter.createNativeFunction(wrapper));

    // Add an API function for the prompt() block.
    var wrapper = function(text) {
        text = text ? text.toString() : '';
        return interpreter.createPrimitive(prompt(text));
    };
    interpreter.setProperty(scope, 'prompt',
        interpreter.createNativeFunction(wrapper));

    // Add an API function for highlighting blocks.
    var wrapper = function(id) {
        id = id ? id.toString() : '';
        return interpreter.createPrimitive(interpreter.runtime.highlightBlock(id));
    };
    interpreter.setProperty(scope, 'highlightBlock',
        interpreter.createNativeFunction(wrapper));

    var wrapper = function(d) {
        return interpreter.createPrimitive(interpreter.runtime.wait(d));
    }
    interpreter.setProperty(scope, 'wait', interpreter.createNativeFunction(wrapper));

    var wrapper = function(speed, dir) {
        return interpreter.createPrimitive(MBlockly.Action.runSpeed(speed, dir));
    }
    interpreter.setProperty(scope, 'runSpeed', interpreter.createNativeFunction(wrapper));

    var wrapper = function(speed, dir) {
        return interpreter.createPrimitive(MBlockly.Action.turnSpeed(speed, dir));
    }
    interpreter.setProperty(scope, 'turnSpeed', interpreter.createNativeFunction(wrapper));

    var wrapper = function(msg) {
        return interpreter.createPrimitive(interpreter.runtime.print(msg));
    }
    interpreter.setProperty(scope, 'print', interpreter.createNativeFunction(wrapper));

    // load everything from blockkeeper
    var keepedBlocks = MBlockly.BlockKeeper.getBlocks();
    for(var blockName in keepedBlocks) {
      var block = keepedBlocks[blockName];
      (function(block) {
        var wrapper = function() {
          return interpreter.createPrimitive(block.handler.apply(interpreter.runtime, arguments));
        }
        interpreter.setProperty(scope, block.funcName, interpreter.createNativeFunction(wrapper));
      })(block);
    }
}