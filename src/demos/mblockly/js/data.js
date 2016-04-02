/**
 * Copyright 2015 Makeblock
 * Author: callblueday
 * Description: provide data save
 * 
 */
'use strict';

// Create a namespace.

MBlockly.Data = {
    storageKey : 'MBlocklyData',
    demo : {
        'demo1': '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="start_whengo" x="133" y="53"><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#ff0000</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#ff6600</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#ffff66</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#33ff33</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#33ccff</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#3333ff</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#cc33cc</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
        'demo2': '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="start_whengo" x="133" y="53"><next><block type="play_tone"><field name="TONE">C5</field><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#ff0000</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="play_tone"><field name="TONE">D5</field><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#ff6600</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="play_tone"><field name="TONE">E5</field><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#ffff66</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="play_tone"><field name="TONE">F5</field><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#33ff33</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="play_tone"><field name="TONE">G5</field><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#33ccff</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="play_tone"><field name="TONE">A5</field><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#3333ff</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="play_tone"><field name="TONE">B5</field><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#cc33cc</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
        'demo3': '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="start_whengo" x="209" y="88"><next><block type="move_run"><field name="DIRECTION">FORWARD</field><value name="SPEED"><block type="math_number_range" max="255" min="7"><field name="NUM">100</field></block></value><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#33ff33</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#ff0000</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="move_run"><field name="DIRECTION">BACKWARD</field><value name="SPEED"><block type="math_number_range" max="255" min="7"><field name="NUM">100</field></block></value><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#ffff33</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#ff0000</field></block></value><next><block type="move_turn"><field name="DIRECTION">LEFT</field><value name="SPEED"><block type="math_number_range" max="255" min="7"><field name="NUM">100</field></block></value><next><block type="play_tone"><field name="TONE">C5</field><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#ffff33</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="move_turn"><field name="DIRECTION">RIGHT</field><value name="SPEED"><block type="math_number_range" max="255" min="7"><field name="NUM">100</field></block></value><next><block type="play_tone"><field name="TONE">E5</field><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#ffff33</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="move_run"><field name="DIRECTION">BACKWARD</field><value name="SPEED"><block type="math_number_range" max="255" min="7"><field name="NUM">100</field></block></value><next><block type="set_led_color"><field name="LED_POSITION">BOTH</field><value name="COLOUR1"><block type="colour_picker"><field name="COLOUR">#ffff33</field></block></value><next><block type="wait"><value name="DELAY"><block type="math_number"><field name="NUM">1</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>'
    },
    storeList : [
        {
            'data': '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="move_run" id="1" x="44" y="163"><field name="DIRECTION">FORWARD</field><value name="SPEED"><block type="math_number" id="2"><field name="NUM">150</field></block></value><next><block type="wait" id="3"><value name="DELAY"><block type="math_number" id="4"><field name="NUM">2</field></block></value><next><block type="move_run" id="99"><field name="DIRECTION">BACKWARD</field><value name="SPEED"><block type="math_number" id="100"><field name="NUM">200</field></block></value></block></next></block></next></block></xml>',
            'name': 'run forward and backward',
            'time': '2015-08-26 09:42',
            'color': '#66cefe',
            'svgCanvas': {
                'content': '<g class="blocklyDraggable" transform="scale(0.8)"><path class="blocklyPathDark" transform="translate(1, 1)" fill="#527ecc" d="m 0,8 A 8,8 0 0,1 8,0 H 15 l 6,4 3,0 6,-4 H 45 H 282.8543395996094 v 50 H 29.5 l -6,4 -3,0 -6,-4 H 0 z M 267.8543395996094,5 h -60.906402587890625 v 5 c 0,10 -10,-8 -10,7.5 s 10,-2.5 10,7.5 v 21 h 60.906402587890625 z"></path><path class="blocklyPath" fill="#669eff" d="m 0,8 A 8,8 0 0,1 8,0 H 15 l 6,4 3,0 6,-4 H 45 H 282.8543395996094 v 50 H 29.5 l -6,4 -3,0 -6,-4 H 0 z M 267.8543395996094,5 h -60.906402587890625 v 5 c 0,10 -10,-8 -10,7.5 s 10,-2.5 10,7.5 v 21 h 60.906402587890625 z"></path><path class="blocklyPathLight" stroke="#94bbff" d="m 0.5,7.5 A 7.5,7.5 0 0,1 8,0.5 H 15 l 6,4 3,0 6,-4 H 44.5 M 44.5,0.5 H 282.3543395996094 M 0.5,49.5 V 8 M 268.3543395996094,5.5 v 41 h -60.906402587890625 M 199.84793701171876,24.3 l 4.6000000000000005,-2.1"></path><g class="blocklyDraggable" transform="translate(207.94793701171875, 6)"><path class="blocklyPathDark" transform="translate(1, 1)" fill="#b552cc" d="m 0,0 H 58.906402587890625 v 39 H 0 V 20 c 0,-10 -10,8 -10,-7.5 s 10,2.5 10,-7.5 z"></path><path class="blocklyPath" fill="#e266ff" d="m 0,0 H 58.906402587890625 v 39 H 0 V 20 c 0,-10 -10,8 -10,-7.5 s 10,2.5 10,-7.5 z"></path><path class="blocklyPathLight" stroke="#eb94ff" d="m 0.5,0.5 H 58.406402587890625 M 58.406402587890625,0.5 M 0.5,38.5 V 18.5 m -9.200000000000001,-0.5 q -1.9,-5.5 0,-11 m 9.200000000000001,1 V 0.5 H 1"></path><g class="blocklyEditableText" transform="translate(15, 25)" style="cursor: text;"><rect rx="4" ry="4" x="-7.5" y="-15" height="20" width="43.906402587890625"></rect><text class="blocklyText">150</text></g></g><g class="blocklyDraggable" transform="translate(0, 51)"><path class="blocklyPathDark" transform="translate(1, 1)" fill="#cc528e" d="m 0,0 H 15 l 6,4 3,0 6,-4 H 45 H 148.4373016357422 v 50 H 29.5 l -6,4 -3,0 -6,-4 H 0 z M 111.05473327636719,5 h -41.635467529296875 v 5 c 0,10 -10,-8 -10,7.5 s 10,-2.5 10,7.5 v 21 h 41.635467529296875 z"></path><path class="blocklyPath" fill="#ff66b2" d="m 0,0 H 15 l 6,4 3,0 6,-4 H 45 H 148.4373016357422 v 50 H 29.5 l -6,4 -3,0 -6,-4 H 0 z M 111.05473327636719,5 h -41.635467529296875 v 5 c 0,10 -10,-8 -10,7.5 s 10,-2.5 10,7.5 v 21 h 41.635467529296875 z"></path><path class="blocklyPathLight" stroke="#ff94c9" d="m 0.5,0.5 H 15 l 6,4 3,0 6,-4 H 44.5 M 44.5,0.5 H 147.9373016357422 M 0.5,49.5 V 0.5 M 111.55473327636719,5.5 v 41 h -41.635467529296875 M 62.31926574707031,24.3 l 4.6000000000000005,-2.1"></path><g class="blocklyDraggable" transform="translate(70.41926574707031, 6)"><path class="blocklyPathDark" transform="translate(1, 1)" fill="#b552cc" d="m 0,0 H 39.635467529296875 v 39 H 0 V 20 c 0,-10 -10,8 -10,-7.5 s 10,2.5 10,-7.5 z"></path><path class="blocklyPath" fill="#e266ff" d="m 0,0 H 39.635467529296875 v 39 H 0 V 20 c 0,-10 -10,8 -10,-7.5 s 10,2.5 10,-7.5 z"></path><path class="blocklyPathLight" stroke="#eb94ff" d="m 0.5,0.5 H 39.135467529296875 M 39.135467529296875,0.5 M 0.5,38.5 V 18.5 m -9.200000000000001,-0.5 q -1.9,-5.5 0,-11 m 9.200000000000001,1 V 0.5 H 1"></path><g class="blocklyEditableText" transform="translate(15, 25)" style="cursor: text;"><rect rx="4" ry="4" x="-7.5" y="-15" height="20" width="24.635467529296875"></rect><text class="blocklyText">2</text></g></g><g class="blocklyDraggable" transform="translate(0, 51)"><path class="blocklyPathDark" transform="translate(1, 1)" fill="#527ecc" d="m 0,0 H 15 l 6,4 3,0 6,-4 H 45 H 293.80690002441406 v 50 H 29.5 l -6,4 -3,0 -6,-4 H 8 a 8,8 0 0,1 -8,-8 z M 278.80690002441406,5 h -60.906402587890625 v 5 c 0,10 -10,-8 -10,7.5 s 10,-2.5 10,7.5 v 21 h 60.906402587890625 z"></path><path class="blocklyPath" fill="#669eff" d="m 0,0 H 15 l 6,4 3,0 6,-4 H 45 H 293.80690002441406 v 50 H 29.5 l -6,4 -3,0 -6,-4 H 8 a 8,8 0 0,1 -8,-8 z M 278.80690002441406,5 h -60.906402587890625 v 5 c 0,10 -10,-8 -10,7.5 s 10,-2.5 10,7.5 v 21 h 60.906402587890625 z"></path><path class="blocklyPathLight" stroke="#94bbff" d="m 0.5,0.5 H 15 l 6,4 3,0 6,-4 H 44.5 M 44.5,0.5 H 293.30690002441406 M 2.6966991411008934,47.30330085889911 A 7.5,7.5 0 0,1 0.5,42 V 0.5 M 279.30690002441406,5.5 v 41 h -60.906402587890625 M 210.80049743652344,24.3 l 4.6000000000000005,-2.1"></path><g class="blocklyDraggable" transform="translate(218.90049743652344, 6)"><path class="blocklyPathDark" transform="translate(1, 1)" fill="#b552cc" d="m 0,0 H 58.906402587890625 v 39 H 0 V 20 c 0,-10 -10,8 -10,-7.5 s 10,2.5 10,-7.5 z"></path><path class="blocklyPath" fill="#e266ff" d="m 0,0 H 58.906402587890625 v 39 H 0 V 20 c 0,-10 -10,8 -10,-7.5 s 10,2.5 10,-7.5 z"></path><path class="blocklyPathLight" stroke="#eb94ff" d="m 0.5,0.5 H 58.406402587890625 M 58.406402587890625,0.5 M 0.5,38.5 V 18.5 m -9.200000000000001,-0.5 q -1.9,-5.5 0,-11 m 9.200000000000001,1 V 0.5 H 1"></path><g class="blocklyEditableText" transform="translate(15, 25)" style="cursor: text;"><rect rx="4" ry="4" x="-7.5" y="-15" height="20" width="43.906402587890625"></rect><text class="blocklyText">200</text></g></g><g transform="translate(15, 30)"><image height="30px" width="30px" y="-19" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/blocks-icon/icon-Move-Forward.svg"></image></g><text class="blocklyText" transform="translate(60, 30)">Run</text><g class="blocklyEditableText" transform="translate(104.54762268066406, 30)" style="cursor: default;"><rect rx="4" ry="4" x="-7.5" y="-15" height="20" width="105.35287475585938"></rect><text class="blocklyText">Backward<tspan style="fill: rgb(102, 158, 255);"> ▾</tspan></text></g></g><text class="blocklyText" transform="translate(15, 30)">wait</text><text class="blocklyText" transform="translate(126.05473327636719, 30)">s</text></g><g transform="translate(15, 30)"><image height="30px" width="30px" y="-19" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/blocks-icon/icon-Move-Forward.svg"></image></g><text class="blocklyText" transform="translate(60, 30)">Run</text><g class="blocklyEditableText" transform="translate(104.54762268066406, 30)" style="cursor: default;"><rect rx="4" ry="4" x="-7.5" y="-15" height="20" width="94.40031433105469"></rect><text class="blocklyText">Forward<tspan style="fill: rgb(102, 158, 255);"> ▾</tspan></text></g></g>',
                'w': 235.846,
                'h': 125.6
            },
            'id': '1440553320000run-forward-and-backward'
        }
    ],
    songList: [
        {
            'name': '我不想静静一个人',
            'id': 'song1',
            'data': ['C2','D2','E2','F2','G2','A2','B2','C3','D3','E3','F3']
        },
        {
            'name': '我想一个人静静',
            'id': 'song2',
            'data': ['G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5','B5','C6','D6','E6','F6','G6','A6','B6','C7']
        }

    ]
};

// add data
MBlockly.Data.add = function(id, data) {
    // var type = 'update';
    // var val = encodeURIComponent(JSON.stringify(value));
    // var args = '&key=' + key + '&value=' + val;

    // MBlockly.Control.sendData(type, args);

    // local update
    MBlockly.Data.storeList.push(data);

    var val = JSON.stringify(this.storeList);
    window.localStorage[this.storageKey] = val;
};

// add data
MBlockly.Data.edit = function(id, data) {
    var dataArray = this.storeList;
    for(var i = 0; i < dataArray.length; i++) {
        if(dataArray[i].id == id) {
            if(isNaN(i)||i>this.storeList.length){
                return false;
            }
            this.storeList.splice(i,1, data);
            break;
        }
    }
    var val = JSON.stringify(this.storeList);
    window.localStorage[this.storageKey] = val;
};


MBlockly.Data.reName = function(newName, id) {
    var dataArray = this.storeList;
    for(var i = 0; i < dataArray.length; i++) {
        if(dataArray[i].id == id) {
            if(isNaN(i)||i>this.storeList.length){
                return false;
            }
            dataArray[i].name = newName;
            break;
        }
    }
    var val = JSON.stringify(this.storeList);
    window.localStorage[this.storageKey] = val;
};


// fetch all data
MBlockly.Data.fetch = function() {
    // var type = 'query';
    // var key = this.storageKey;
    // var args = '';
    // MBlockly.Control.sendData(type, args);

    var dataString = window.localStorage[this.storageKey];
    if(dataString && JSON.parse(dataString).length) {
        this.storeList = JSON.parse(dataString);
    }
    return this.storeList;
};

// delete one item
MBlockly.Data.delete = function(id) {
    // var type = 'delete';
    // var args = '&key=' + id;
    // MBlockly.Control.sendData(type, args);

    var dataArray = this.storeList;
    for(var i = 0; i < dataArray.length; i++) {
        if(dataArray[i].id == id) {
            if(isNaN(i)||i>this.storeList.length){
                return false;
            } 
            this.storeList.splice(i,1);
            break;
        }
    }
    window.localStorage[this.storageKey] = JSON.stringify(this.storeList);
};

// get one item
MBlockly.Data.getOne = function(id) {
    var dataArray = this.storeList;
    for(var i = 0; i < dataArray.length; i++) {
        if(dataArray[i].id == id) {
           return dataArray[i];
        }
    }
};

// clear all data
MBlockly.Data.clear = function() {
    var type = 'clear';
    var key = this.storageKey;
    var args = '&key=' + key;
    MBlockly.Control.sendData(type, args);
};





MBlockly.Data.fetchData_callback = function(state, dataString) {
    MBlockly.Action.out('query');
    if(state == 1) {
        console.log(dataString);
        var data = JSON.parse(decodeURIComponent(dataString));
        MBlockly.Action.out(data.length);
        MBlockly.Action.out('-------length--------');
        if(dataString && data.length) {
            this.storeList = [];
            for(var i; i < data.length; i++) {
                var item = JSON.parse(decodeURIComponent(data[i]));
                this.storeList.push(item);
            }
        }
    }
    MBlockly.App.renderProject();
};


MBlockly.Data.deleteData_callback = function(state, dataString) {
    MBlockly.Action.out('delete');
    if(state == 1) {
        MBlockly.Action.out(dataString);
        var dataArray = this.storeList;
        for(var i = 0; i < dataArray.length; i++) {
            if(dataArray[i][id]) {
                if(isNaN(i)||i>this.storeList.length){
                    return false;
                } 
                this.storeList.splice(i,1);
            }
        }
    }
};

MBlockly.Data.updateData_callback = function(state, data) {
    MBlockly.Action.out('update');
    if(state == 1) {
        var dataString = decodeURIComponent(data);
        MBlockly.Action.out(dataString);
        if(dataString && JSON.parse(dataString).length) {
            this.storeList.push(JSON.parse(dataString));
        }
    }
};

MBlockly.Data.clearData_callback = function(state, dataString) {
    state ? state : (state = 1);
    alert(state);
};