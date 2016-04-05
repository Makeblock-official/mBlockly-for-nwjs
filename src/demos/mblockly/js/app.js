/**
 * @copyright 2015 Makeblock
 * @author callblueday
 * @description define base interactive actions for the stage
 */

'use strict';

goog.provide('MBlockly.App');

goog.require('MBlockly.Runtime');
goog.require('MBlockly.Control');

MBlockly.App = {
    colour: ['#66cefe', '#66a0ff', '#7f67fe', '#ffcd65', '#fe9666', '#e88dff', '#ff68b4'],
    scale: 0.7,
    currentProject: null,
    dialog: null
};

MBlockly.App.EventTimer = {
    queue: [],
    timer: null,
    addListener: function(listener){
        this.queue.push(listener);
        if(this.timer == null){
            this.timer = setInterval(function(){
                var callback = MBlockly.App.EventTimer.queue.shift();
                if(callback){
                    MBlockly.App.EventTimer.queue.push(callback);
                    callback();
                }
            }, 200);
        }
    },
    clearAll : function(){
        clearInterval(this.timer);
        this.timer = null;
        this.queue = [];
    }
};

MBlockly.App.onLoad = function(){
    var self = this;
    MBlockly.App.numTopBlocks = 0;
    // event listener when workspace change
    workspace.fireChangeEvent = function(){
        //check top blocks
        var topBlocks = workspace.getTopBlocks();
        var registerEvent = function(eventName, block){
            MBlockly.Control.addDeviceEventListener(eventName, (function(startBlock){
                return function(){
                    self.activeRuntime = MBlockly.Runtime.runFromBlock(workspace, startBlock);
                    MBlockly.App.switchGoButtonToStop();
                };
            })(block));
        };
        var registerWhenEvent = function(block){
            MBlockly.App.EventTimer.addListener(function(){
                var conditionBlock = block.getInputTargetBlock('WHEN');
                var statementsBlock = block.getInputTargetBlock('DO');
                if(conditionBlock && statementsBlock && MBlockly.Control.bluetoothConnected){
                    MBlockly.Runtime.runFromBlock(workspace, block);
                }
            });
        }
        if(topBlocks.length != MBlockly.App.numTopBlocks){
            MBlockly.App.numTopBlocks = topBlocks.length;
            MBlockly.Control.clearAllDeviceEventListeners();
            MBlockly.App.EventTimer.clearAll();
            for (var i=0; i<topBlocks.length; i++){
                if(topBlocks[i].type == 'when_shake'){
                    registerEvent('shake', topBlocks[i]);
                }
                else if(topBlocks[i].type == 'start_whenif'){
                    registerWhenEvent(topBlocks[i]);
                }
                else if(topBlocks[i].type == 'when_tablet_tilt_forward'){
                    registerEvent('when_tablet_tilt_forward', topBlocks[i]);
                }
                else if(topBlocks[i].type == 'when_tablet_tilt_backward'){
                    registerEvent('when_tablet_tilt_backward', topBlocks[i]);
                }
                else if(topBlocks[i].type == 'when_tablet_tilt_left'){
                    registerEvent('when_tablet_tilt_left', topBlocks[i]);
                }
                else if(topBlocks[i].type == 'when_tablet_tilt_right'){
                    registerEvent('when_tablet_tilt_right', topBlocks[i]);
                }
                else if(topBlocks[i].type == 'when_receieve_light'){
                    registerEvent('when_receieve_light', topBlocks[i]);
                }
                else if(topBlocks[i].type == 'when_obstacle_ahead'){
                    registerEvent('when_obstacle_ahead', topBlocks[i]);
                }
                else if(topBlocks[i].type == 'when_button_on_top_pressed'){
                    registerEvent('when_button_on_top_pressed', topBlocks[i]);
                }
            }
        }
    };

    workspace.onBlockMouseUp = function(){
        $('#blockDeletionMask').hide();
        $('#blockDeletionMask').removeClass('mouse-over');
    };

    workspace.onMouseOutToolboxDeletionZone = function(){
        $('#blockDeletionMask').show();
        $('#blockDeletionMask').removeClass('mouse-over');
    };

    workspace.onMouseOverToolboxDeletionZone = function(){
        $('#blockDeletionMask').show();
        $('#blockDeletionMask').addClass('mouse-over');
    };
};

/**
 * Save blocks to localStrorage.
 * @param  {string} name project name.
 */
MBlockly.App.save = function(name) {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    if(name) {
        var id = new Date().getTime() + name.split(' ').join('-');

        var storeItem = {};
        storeItem.name = name;
        storeItem.id = id;
        storeItem.data =  Blockly.Xml.domToText(xml);
        storeItem.time  = date2str(new Date(),"yyyy-MM-dd hh:mm");

        var svgOrigin = $(workspace.svgBlockCanvas_)
        var svgContent = svgOrigin.clone();
        var w = svgOrigin.width()*this.scale;
        var h = svgOrigin.height()*this.scale;
        svgContent.children().attr('transform','scale(' + this.scale + ')').removeClass('blocklySelected');
        storeItem.svgCanvas = {};

        if(svgContent.children()[0]) {
            storeItem.svgCanvas.content = new XMLSerializer().serializeToString(svgContent.children()[0]);
        } else {
            return false;
        }

        storeItem.svgCanvas.w = w;
        storeItem.svgCanvas.h = h;

        var color = 'rgba(' + parseInt(Math.random()*255) +',' + Math.min(parseInt(Math.random()*255), 200) +',' + parseInt(Math.random()*255) +', .7)';
        storeItem.color = color;

        // send request to native to update a data
        MBlockly.Data.add(id, storeItem);
    }
};

/**
 * Edit project.
 * @param  {string} name project new name.
 * @param  {number} id   project id.
 */
MBlockly.App.edit = function(name, id) {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    if(name) {
        var storeItem = {};
        storeItem.name = name;
        storeItem.id = id;
        storeItem.data =  Blockly.Xml.domToText(xml);
        storeItem.time  = date2str(new Date(),"yyyy-MM-dd hh:mm");

        var svgOrigin = $(workspace.svgBlockCanvas_)
        var svgContent = svgOrigin.clone();
        var w = svgOrigin.width()*this.scale;
        var h = svgOrigin.height()*this.scale;
        svgContent.children().attr('transform','scale(' + this.scale + ')').removeClass('blocklySelected');
        storeItem.svgCanvas = {};

        if(svgContent.children()[0]) {
            storeItem.svgCanvas.content = new XMLSerializer().serializeToString(svgContent.children()[0]);
        } else {
            return false;
        }

        storeItem.svgCanvas.w = w;
        storeItem.svgCanvas.h = h;

        var color = 'rgba(' + parseInt(Math.random()*255) +',' + Math.min(parseInt(Math.random()*255), 200) +',' + parseInt(Math.random()*255) +', .7)';
        storeItem.color = color;

        // send request to native to update a data
        MBlockly.Data.edit(this.currentProject.id, storeItem);
    }
};

/**
 * Show my project panel.
 */
MBlockly.App.showRestorePanel = function() {
    this.showStage();
    $('.right-panel').hide();
    $('#menuRight').css('right', 0);
    $('.restorePanel').show();

    // fetch data from native
    MBlockly.Data.fetch();
    this.renderProject();
};

MBlockly.App.renderProject = function() {
    $('.restore-list').html('');
    var data = MBlockly.Data.storeList;

    $(data).forEach(function(item, i) {
        var color = '';

        if(!item.svgCanvas) {
            item.svgCanvas = '';
            if(item.color) {
                color = item.color;
            } else {
                color = 'rgba(' + parseInt(Math.random()*255) +',' + Math.min(parseInt(Math.random()*255), 200) +',' + parseInt(Math.random()*255) +', .7)';
            }
        }
        if(!item.time) {
            item.time = '';
        }

        var parentW = ($('.restore-list').width()*0.333333 - 30);
        var svgW = (item.svgCanvas.w >= parentW) ? parentW*0.9 : item.svgCanvas.w;
        var svgH = (item.svgCanvas.h >= 180) ? 160 : item.svgCanvas.h;

        var itemHtml = '<li class="item" data-id="' + item.id + '">' +
        '<div class="img-wrap">' +
            '<svg translate(0,0) style="width:' + svgW + 'px;margin-left:-' + svgW*0.5 + 'px;height:' + svgH + 'px;margin-top:-' + svgH*0.5 + 'px;">' + item.svgCanvas.content + '</svg>' +
        '</div>' +
        '<div class="mask" data-name="' + item.name + '" data-id="' + item.id + '"></div>' +
        '<i class="project-edit-icon fa fa-edit"></i>' +
        '<div class="ops"><i class="delete"></i><i class="fa fa-pencil edit"></i></div>' +
        '<div class="description">' +
        '<h3>' + item.name + '</h3>' +
        '<p class="time">' + item.time + '</p>' +
        '</div>' +
        '</li>';

        $('.restore-list').append($(itemHtml));
    });
};

/**
 * Check device type to discriminate click and tap events.
 */
MBlockly.App.checkDeviceType = function() {
    var eventType;
    if(goog.userAgent.MOBILE) {
        eventType = 'tap';
    } else {
        eventType = 'click';
    }
    return eventType;
};

/**
 * Clear store data.
 */
MBlockly.App.clear = function() {
    Blockly.mainWorkspace.clear();
};

/**
 * Load certain project.
 * @param {number} id project id.
 */
MBlockly.App.loadProject = function(id) {
    this.hideRightMenu();
    Blockly.mainWorkspace.clear();

    this.currentProject = MBlockly.Data.getOne(id);

    var xml = Blockly.Xml.textToDom(this.currentProject['data']);
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
};

/**
 * Delete certain project
 * @param  {number} id     project id.
 * @param  {object} target dom element warpper of the project.
 */
MBlockly.App.deleteProject = function(id, target) {
    $(target).remove();
    MBlockly.Data.delete(id);
};

/**
 * Load store Demo.
 * @param {number} demoId demo id.
 */
MBlockly.App.loadDemo = function(demoId) {
        this.hideRightMenu();
        Blockly.mainWorkspace.clear();
        var xml = Blockly.Xml.textToDom(MBlockly.Data.demo[demoId]);
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
};

/**
 * Clear mainWorkspace.
 */
MBlockly.App.clearMainWorkspace = function() {
    Blockly.mainWorkspace.clear();
};

/**
 * Hide menuRight.
 */
MBlockly.App.hideRightMenu = function() {
    $('#menuRight').css('right', '-100%');
};

/**
 * Show menuRight.
 * @private
 */
MBlockly.App.showRightMenu = function() {
    $('#menuRight').css('right', 0);
};

MBlockly.App.showStart = function() {
    this.clear();
    this.currentProject = null;
    $('.scene').removeClass('active');
    $('.start').addClass('active');
    MBlockly.Control.sendData('pageSwitch', '&currentPage=start');
};

MBlockly.App.showStage = function() {
    MBlockly.Control.sendData('pageSwitch', '&currentPage=others');
    $('.scene').removeClass('active');
    $('.stage').addClass('active');
};

MBlockly.App.showDemoPanel = function() {
    $('.right-panel').hide();
    $('#menuRight').css('right', 0);
    $('.demoPanel').show();
};

MBlockly.App.isWorkspaceEmpty = function() {
    return !(workspace.svgBlockCanvas_.childElementCount > 0);
};

/**
 * Star button animation when play the program.
 * @param {object} event dom event object.
 */
MBlockly.App.popStar = function(event) {
    var ani =  event.currentTarget.children[0];
    if(!ani) {
        return false;
    }
    ani.setAttribute('class', 'star star-active');
    setTimeout(function() {
        ani.style.display = "none";
    }, 800);

    setTimeout(function() {
        ani.setAttribute('class', 'star');
        ani.style.display = "block";
    }, 800);
};

/**
 * Start the current stage's program.
 * @param {object} event dom event object.
 */
MBlockly.App.runCode = function(event) {
    var self = this;
    if(!this.activeRuntime){
        MBlockly.Control.bleLastTimeConnected = true;   // popup bluetooth connect dialog
                                                        //if ble is not connected
        this.activeRuntime = MBlockly.Runtime.run(workspace);
        this.popStar(event);
        MBlockly.App.switchGoButtonToStop();            // this line relies on "this.activeRuntime"
        /* -- commented code : only run "when start" block
        var topBlocks = workspace.getTopBlocks();
        // if start block is undefined, search for 'start_whengo' block
        for (var i=0; i<topBlocks.length; i++){
          if(topBlocks[i].type == 'start_whengo'){
            this.activeRuntime = MBlockly.Runtime.runFromBlock(workspace, topBlocks[i]);
            this.popStar(event);
            MBlockly.App.switchGoButtonToStop();
            break;
          }
        }
        // end of if (driven by for-break) - shouldn't have anything before else
        */
    }
    else{
        this.activeRuntime.stop();
        this.activeRuntime.isFinished = true;
        this.activeRuntime = null;
        MBlockly.Control.stopAll();
        this.setRunIcon();
    }
};

MBlockly.App.switchGoButtonToStop = function(){
    var self = this;
    self.setStopIcon();
    this.activeRuntime.onFinish = function(){
        if(!MBlockly.Control.isMotorMoving){
            self.setRunIcon();
            self.activeRuntime = null;
        }
    }
};

MBlockly.App.setRunIcon = function() {
    $('#runButtonLabel').text(Blockly.Msg.UI_LABEL_GO);

    if($('#sideButtons .run').length) {
        $('#sideButtons .run').css({
            'background-image': 'url(images/play.svg)'
        });
    }
};

MBlockly.App.setStopIcon = function() {
    $('#runButtonLabel').text(Blockly.Msg.UI_LABEL_STOP);

    if($('#sideButtons .run').length) {
        $('#sideButtons .run').css({
            'background-image': 'url(images/pause.svg)'
        });
    }
};

MBlockly.App.hideEditMask = function() {
    $('.item .mask').css({
        'opacity': '0'
    });
    $('.restore-list').find('.ops').hide();
};

$(function() {
    var eventType = MBlockly.App.checkDeviceType();
    var app = MBlockly.App;

    // start
    app.onLoad();

    $('.close-btn').on(eventType, function() {
        app.hideRightMenu();
    });

    $('.create-project-btn').on(eventType, function() {
        app.showStage();
    });

    $('#panel').on(eventType, function(event) {
        $('.dialog').hide();
    });

    $('.my-project-btn').on(eventType, function() {
        app.showRestorePanel();
    });

    // Go
    $('.run').on(eventType, function(e) {
        app.runCode(e);
    });

    $('.close-btn').on(eventType, function() {
        app.hideRightMenu();
    });

    $('.load-demo').on(eventType, function() {
        var id = 'demo' + $(this).attr('data-id');
        app.loadDemo(id);
    });

    // demoBtn
    $('#demoBtn').on(eventType, function() {
        app.showDemoPanel();
    });

    // logo
    $('.logo').on(eventType, function() {
        if(app.isWorkspaceEmpty()) {
            app.showStart();
        } else {
            app.dialog = new Dialog({
                cancelCallback: function() {
                    app.currentProject = null;
                    app.showStart();
                },
                okCallback: function() {
                    app.currentProject = null;
                    app.showStart();
                },
                saveAsNewCallback: function() {
                    app.currentProject = null;
                    app.showStart();
                }
            });
        }
    });

    // saveBtn
    $('#saveBtn').on(eventType, function() {
        app.dialog = new Dialog({
            cancelCallback: function() {

            },
            okCallback: function() {

            },
            saveAsNewCallback: function() {

            }
        });
    });

    // newProjectBtn
    $('#newProjectBtn').on(eventType, function() {
        if(app.isWorkspaceEmpty()) {
            app.clear();
            app.currentProject = null;
        } else {
            app.dialog = new Dialog({
                beforeShow: function() {
                    $('.cancel').show();
                },
                cancelCallback: function() {
                    app.currentProject = null;
                    app.clear();
                },
                okCallback: function() {
                    app.currentProject = null;
                    app.clear();
                },
                saveAsNewCallback: function() {
                    app.currentProject = null;
                    app.clear();
                }
            });
        }
    });

    // myProjectBtn
    $('#myProjectBtn').on(eventType, function(e) {
        app.showRestorePanel();
        e.stopPropagation();
    });

    $('.restore-list').on(eventType, '.item .mask', function(e) {
        var id = $(this).attr('data-id');
        app.loadProject(id);
        e.stopPropagation();
    });

    $('.restore-list').on('click', '.project-edit-icon', function(e) {
        console.log(2);
        $(this).parent().find(".mask").css({
            'opacity': 1
        });

        $(this).parent().find('.ops').show();
        e.stopPropagation();
    });

    // $('.restore-list').on('longTap', '.item .mask', function(e) {
    //     $(this).css({
    //         'opacity': 1
    //     });

    //     $(this).parent().find('.ops').show();
    // });

    $('.restore-list').on(eventType, '.item .delete', function(e) {
        e.stopPropagation();
        var id = $(this).parents('.item').find('.mask').attr('data-id');
        var target = $(this).parents('.item');

        app.dialog = new Dialog({
            type: 'delete',
            beforeShow: function() {
                $('.dialog .save-as-new').hide();
                $('.dialog .head .title').html(Blockly.Msg.Dialog_DELETE);
                $('.dialog .body').hide();
                $('.dialog').show();
            },
            cancelCallback: function() {
                app.hideEditMask();
            },
            okCallback: function(newName) {
                app.deleteProject(id, target);
                app.hideEditMask();
            }
        });
    });

    $('.restorePanel').on(eventType, function(e) {
        app.hideEditMask();
        e.stopPropagation();
    });

    $('.restore-list').on(eventType, '.item .edit', function(e) {
        var id = $(this).parents('.item').find('.mask').attr('data-id');
        var name = $(this).parents('.item').find('.mask').attr('data-name');
        var that = this;

        app.dialog = new Dialog({
            type: 'edit',
            beforeShow: function() {
                $('.dialog .save-as-new').hide();
                $('.dialog .head .title').html(Blockly.Msg.Dialog_RENAME);
                $('.dialog input').val(name);
                $('.dialog').show();
            },
            cancelCallback: function() {
                app.hideEditMask();
            },
            okCallback: function(newName) {
                MBlockly.Data.reName(newName, id);
                $(that).parents('.item').find('h3').html(newName);
                app.hideEditMask();
            }
        });

        e.stopPropagation();
    });

    // buzzerBtn
    $('#buzzerBtn').on(eventType, function() {
       MBlockly.Control.buzzer();
    });

    // ledbtn
    $('#ledBtn').on(eventType, function() {
        MBlockly.Control.setLed(Math.random()*255, Math.random()*255, Math.random()*255);
    });

    // stopBtn
    $('#stopBtn').on(eventType, function() {
        MBlockly.Control.stopAll();
    });


    $('.hide-log-btn').on(eventType, function() {
        $('#log').css({
            'height': 50
        });
    });

    $('.show-log-btn').on(eventType, function() {
        $('#log').css({
            'height': 600
        });
    });

    // data test
    $('#query').on(eventType, function() {
        MBlockly.Data.fetch();
    });

    $('#delete').on(eventType, function() {
        MBlockly.Data.delete('nihao');
    });

    $('#update').on(eventType, function() {
        var id = new Date().getTime() + 'nihao';
        var a = MBlockly.Data.storeList[1];
        a.id = id;
       MBlockly.Data.update(id, a);
    });
});

function date2str(x,y) {
    var z = {
        M: x.getMonth()+1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
      return ((v.length>1?"0":"")+eval('z.'+v.slice(-1))).slice(-2);
    });
    return y.replace(/(y+)/g,function(v) {return x.getFullYear().toString().slice(-v.length);});
}

function clearLog() {
    $('#log').html('');
}

/* dialog */
function Dialog(options) {
    var that = this;
    var eventType = MBlockly.App.checkDeviceType();
    var app = MBlockly.App;
    var $dialog = $('.dialog');
    options ? options : {};

    var defaultOptions = {
        type: '',
        cancelValue: 'No',
        okValue: 'Ok',
        saveAsNewValue: 'Save as new',

        beforeShow: null,
        onShow: function() {
            this.registerEvents();
            $('.dialog .body').show();
            $('.dialog .head .title').html(Blockly.Msg.Dialog_SAVE);

            if(!app.isWorkspaceEmpty() && this.type != 'edit') {
                $('.save-as-new').hide();
                if(app.currentProject && app.currentProject.id) {
                    $('.dialog .head .title').html(Blockly.Msg.Dialog_OVERWRITE);
                    $('.dialog input').val(app.currentProject.name);
                    $('.save-as-new').show();
                } else {
                    $('.dialog input').val("");
                }
                $('.dialog').show();
            }
        },
        hide: function() {
            document.activeElement.blur();
            $("input").blur();
            setTimeout(function(){window.scrollTo(0,0);}, 50)

            $('.dialog').hide();
            this.removeEvents();
            app.dialog = null;
        },
        removeEvents: function() {
            $('.cancel').off();
            $('.ok').off();
            $('.save-as-new').off();
        },
        registerEvents: function() {
            $('.cancel').on(eventType, function() {
                that.hide();
                if(that.cancelCallback !== null) {
                    that.cancelCallback();
                }
            });

            $dialog.find('[name=projectName]').on('focus', function(e){
                e.preventDefault();
                e.stopPropagation();
                $('.dialog').css('top', '30%');
            })

            $('.ok').on(eventType, function(e) {
                if(that.type == 'delete') {
                    // callback
                    if(that.okCallback !== null) {
                        that.okCallback(name);
                    }
                    that.hide();
                } else {
                    var name = $dialog.find('[name=projectName]').val();
                    if(name && name.length) {

                        if(that.type != 'edit') {
                            if(app.currentProject && app.currentProject.id) {
                                app.edit(name, app.currentProject.id);  // update
                            } else {
                                app.save(name); // add
                            }
                        }

                        // callback
                        if(that.okCallback !== null) {
                            that.okCallback(name);
                        }
                        that.hide();
                    }
                }
            });

            $('.save-as-new').on(eventType, function() {
                var name = $dialog.find('[name=projectName]').val();
                if(name && name.length) {
                    that.hide();
                    app.save(name);

                    if(that.saveAsNewCallback !== null) {
                        that.saveAsNewCallback();
                    }
                }
            });
        },
        cancelCallback: null,
        okCallback: null,
        saveAsNewCallback: null
    };

    var option = $.extend(defaultOptions, options);
    $.extend(Dialog.prototype, option);

    if(this.title) {
        $dialog.find('.head .title').html(this.title);
    }

    // close-btn
    $dialog.find('.dialog-close-btn').on(eventType, function() {
        that.hide();
    });

    // onshow
    if(that.onShow !== null && that.onShow !== undefined) {
        that.onShow();
    }

    // beforeshow
    if(that.beforeShow !== null && that.beforeShow !== undefined) {
        that.beforeShow();
    }

    // edit
    if(that.onEdit !== null && that.onEdit !== undefined) {
        that.onEdit();
    }
}
