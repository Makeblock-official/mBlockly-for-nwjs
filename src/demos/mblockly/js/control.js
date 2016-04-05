/**
 * @copyright 2015 Makeblock
 * @author callblueday
 * @description hardware modules control command in mbot such as motors, led, tone, ultrasonic sensor,
 * linefollow sensor.
 */

MBlockly.Control = {
    buffer : [],
    beginCode : [255, 85],
    endCode : [13, 10],
    baseSpeed: 85,
    currentMode: 0,
    timeCount: 0,
    ulTimer: null,   // ultrasoinic timer
    lineTimer: null, // linefollow timer
    flag4Left: 0,
    flag4Right: 0,

    tabletTiltLeftRightStatus: 0,
    tabletTiltForwardBackwardStatus: 0,
    tabletLastShakeTime: 0,
    bluetoothConnected: false,
    bleLastTimeConnected: true,

    eventMessenger: {}, // a dummy object for binding events
    isMotorMoving: false,

    LINEFOLLOWER_VALUE: {
        'BLACK_BLACK': 128,
        'BLACK_WHITE': 64,
        'WHITE_BLACK': 191,
        'WHITE_WHITE': 0
    },

    SETTING : {
        protocol: 'com.xeecos.blockly://demo?',
        CODE_COMMON: [0xff, 0x55, 0],
        READ_CHUNK_PREFIX: [255, 85],
        READ_CHUNK_SUFFIX: [13, 10],
        READ_BYTES_INDEX: 2,

        //device type
        DEV_VERSION: 0,
        DEV_ULTRASOINIC: 1,
        DEV_TEMPERATURE: 2,
        DEV_LIGHTSENSOR: 31,
        DEV_POTENTIALMETER: 4,
        DEV_GYRO: 6,
        DEV_SOUNDSENSOR: 7,
        DEV_RGBLED: 8,
        DEV_SEVSEG: 9,
        DEV_DCMOTOR: 10,
        DEV_SERVO: 11,
        DEV_ENCODER: 12,
        DEV_JOYSTICK: 13,
        DEV_PIRMOTION: 15,
        DEV_INFRADRED: 16,
        DEV_LINEFOLLOWER: 17,
        DEV_BUTTON: 18,
        DEV_TOPBUTTON: 31,
        DEV_LIMITSWITCH: 19,
        DEV_PINDIGITAL: 30,
        DEV_PINANALOG: 31,
        DEV_PINPWM: 32,
        DEV_PINANGLE: 33,
        TONE: 34,

        SLOT_1: 1,
        SLOT_2: 2,

        READMODULE: 1,
        WRITEMODULE: 2,

        VERSION_INDEX: 0xFA,

        PORT_M1: 9,
        PORT_M2: 10,

        PORT_ULTRASOINIC:  3,
        PORT_LINEFOLLOWER: 2,
        PORT_LIGHTSENSOR: 6,
        PORT_TOPBUTTON: 7,

        //RGB
        RGB_BRIGHTNESS: 20,

        // tone
        TONE_HZ: [262,294,330,349,392,440,494]
    }
};

// Tone value list.
MBlockly.Control.ToneHzTable = {
    "C2":65, "D2":73, "E2":82, "F2":87, "G2":98, "A2":110, "B2":123, "C3":131, "D3":147, "E3":165, "F3":175, "G3":196, "A3":220, "B3":247, "C4":262, "D4":294, "E4":330, "F4":349, "G4":392, "A4":440, "B4":494, "C5":523, "D5":587, "E5":658, "F5":698, "G5":784, "A5":880, "B5":988, "C6":1047, "D6":1175, "E6":1319, "F6":1397, "G6":1568, "A6":1760, "B6":1976, "C7":2093, "D7":2349, "E7":2637, "F7":2794, "G7":3136, "A7":3520, "B7":3951, "C8":4186
};

/**
 * Send serialport data.
 * @param  {array} a array of command.
 */
MBlockly.Control.sendRequest = function(a) {
    var code = a.join(' ');
    if(this.bluetoothConnected){
        console.log(a);
        var msg = {};
        msg.action = "command";
		msg.buffer = [a.length].concat(a);
		chrome.runtime.sendMessage(msg, function (response) {});
    }
    else{
        if(this.bleLastTimeConnected){
            this.sendBleReconnectRequest();
            this.bleLastTimeConnected = false;
            this.isMotorMoving = false;
            throw "BleDisconnected";
        }
    }
};

MBlockly.Control.sendBleReconnectRequest = function() {
    //document.location = this.SETTING.protocol + 'type=ble_reconnect';
};

MBlockly.Control.sendData = function(type, args, opt_callback) {
    //document.location = this.SETTING.protocol + 'type=' + type + args;
};


/**
 * Build write code.
 * @private
 */
MBlockly.Control.buildModuleWriteShort = function(type, port, slot, value) {
    var a = new Array(10);
    a[0] = this.SETTING.CODE_COMMON[0];
    a[1] = this.SETTING.CODE_COMMON[1];
    a[2] = 0x6;
    a[3] = 0;
    a[4] = this.SETTING.WRITEMODULE;
    a[5] = type;
    a[6] = port;
    a[7] = value&0xff;
    a[8] = (value>>8)&0xff;
    a[9] = this.SETTING.CODE_COMMON[2];
    this.sendRequest(a);
};

/**
 * Build write code.
 * @private
 */
MBlockly.Control.buildModuleRead = function(type, port, slot, index) {
    var a = new Array(9);
    a[0] = this.SETTING.CODE_COMMON[0];
    a[1] = this.SETTING.CODE_COMMON[1];
    a[2] = 0x5;
    a[3] = index;
    a[4] = READMODULE;
    a[5] = type;
    a[6] = port;
    a[7] = slot;
    a[8] = this.SETTING.CODE_COMMON[2];
    this.sendRequest(a);
};

/**
 * Build RGB machine code.
 * @private
 */
MBlockly.Control.buildModuleWriteRGB = function(type, port, slot, index, r, g, b) {
    var a = new Array(12);
    a[0] = this.SETTING.CODE_COMMON[0];
    a[1] = this.SETTING.CODE_COMMON[1];
    a[2] = 0x8;
    a[3] = 0;
    a[4] = this.SETTING.WRITEMODULE;
    a[5] = type;
    a[6] = port;
    a[7] = index;
    a[8] = r;
    a[9] = g;
    a[10] = b;
    a[11] = this.SETTING.CODE_COMMON[2];
    this.sendRequest(a);
};

/**
 * Build Buzzer machine code.
 * @private
 */
MBlockly.Control.buildModuleWriteBuzzer = function(hz) {
    var a = new Array(10);
    a[0] = this.SETTING.CODE_COMMON[0];
    a[1] = this.SETTING.CODE_COMMON[1];
    a[2] = 0x5;
    a[3] = 0;
    a[4] = this.SETTING.WRITEMODULE;
    a[5] = this.SETTING.TONE;
    a[6] = hz&0xff;
    a[7] = (hz>>8)&0xff;

    a[8] = 0;
    a[9] = this.SETTING.CODE_COMMON[2];
    this.sendRequest(a);
};

/**
 * Build Read code.
 * @private
 */
MBlockly.Control.buildModuleRead = function(type, port, slot, index) {
    var a = new Array(9);
    a[0] = this.SETTING.CODE_COMMON[0];
    a[1] = this.SETTING.CODE_COMMON[1];
    a[2] = 0x5;
    a[3] = index;
    a[4] = this.SETTING.READMODULE;
    a[5] = type;
    a[6] = port;
    a[7] = slot;
    a[8] = this.SETTING.CODE_COMMON[2];
    this.sendRequest(a);
    console.log('module-read: '+a);
};

/**
 * Code for reading value from ultrasonic / linefollow
 */
MBlockly.Control.ValueWrapper = function(){
};

MBlockly.Control.ValueWrapper.prototype.toString = function(){
    return this.val;
};

MBlockly.Control.ValueWrapper.prototype.setValue = function(value){
    this.val = value;
};

MBlockly.Control.PromiseList = {
    requestList: new Array(256),
    index: 1
};

MBlockly.Control.PromiseType = {
    ULTRASONIC: 1,
    LINEFOLLOW: 2,
    LIGHTSENSOR: 3,
    ON_TOP_BUTTON: 4
};

MBlockly.Control.PromiseList.add = function(type, callback, valueWrapper){
    this.index++;
    if(this.index > 255){
        this.index = 1;
    }
    this.requestList[this.index] = {type:type, callback: callback, valueWrapper: valueWrapper};
    return this.index;
};

MBlockly.Control.PromiseList.receiveValue = function(index, value){
    if(this.requestList[index]){
        this.requestList[index].valueWrapper.setValue(value);
        this.requestList[index].callback(value);
    }
};

MBlockly.Control.PromiseList.getType = function(index){
    return this.requestList[index].type;
};

MBlockly.Control.getUltrasonicValue = function(callback){
    var valueWrapper = new MBlockly.Control.ValueWrapper();
    var index = MBlockly.Control.PromiseList
                        .add(MBlockly.Control.PromiseType.ULTRASONIC, callback, valueWrapper);
    MBlockly.Control.ultrasoinic(0, index);
    return valueWrapper;
};

MBlockly.Control.getLineFollowValue = function(callback){
    var valueWrapper = new MBlockly.Control.ValueWrapper();
    var index = MBlockly.Control.PromiseList
                        .add(MBlockly.Control.PromiseType.LINEFOLLOW, callback, valueWrapper);
    MBlockly.Control.lineFollow(0, index);
    return valueWrapper;
};

MBlockly.Control.getLightSensorValue = function(callback){
    var valueWrapper = new MBlockly.Control.ValueWrapper();
    var index = MBlockly.Control.PromiseList
                        .add(MBlockly.Control.PromiseType.LIGHTSENSOR, callback, valueWrapper);
    MBlockly.Control.lightSensor(0, index);
    return valueWrapper;
};

MBlockly.Control.getOnTopButtonValue = function(callback){
    var valueWrapper = new MBlockly.Control.ValueWrapper();
    var index = MBlockly.Control.PromiseList
                        .add(MBlockly.Control.PromiseType.ON_TOP_BUTTON, callback, valueWrapper);
    MBlockly.Control.onTopButton(0, index);
    return valueWrapper;
};

MBlockly.Control.LineFollowCode = {
    ON_TRACK: 0,
    TURN_RIGHT: 64,
    TURN_BACK: 128,
    TURN_LEFT: 191
};

MBlockly.Control.lineFollow_callback = function() {
    // console.log('--linefollow callback: '+this.buffer.join(','));
    if(this.buffer[0] == 0xff && this.buffer[1] == 0x55) {

        var sum = parseInt(this.buffer[7]) + parseInt(this.buffer[6]);
        console.log('--linefollow sum: '+sum)
        MBlockly.Control.PromiseList.receiveValue(this.buffer[this.SETTING.READ_BYTES_INDEX], sum);
    }
};

MBlockly.Control.ultrasoinic_callback = function() {
    console.log('--ultrasonic callback: '+this.buffer.join(','));

    if(this.buffer[0] == 0xff && this.buffer[1] == 0x55) {
        this.out(this.buffer[7] + '-' + this.buffer[6] + '-' + this.buffer[5] + '-' + this.buffer[4]);
        var distance = this.getResponseValue(parseInt(this.buffer[7]), parseInt(this.buffer[6]), parseInt(this.buffer[5]), parseInt(this.buffer[4]));
        MBlockly.Control.PromiseList.receiveValue(this.buffer[this.SETTING.READ_BYTES_INDEX], distance);
    } else {
        this.out('end');
    }
};

MBlockly.Control.lightSensor_callback = function() {
    console.log('--lightsensor callback: '+this.buffer.join(','));

    if(this.buffer[0] == 0xff && this.buffer[1] == 0x55) {
        var lightness = this.getResponseValue(parseInt(this.buffer[7]), parseInt(this.buffer[6]), parseInt(this.buffer[5]), parseInt(this.buffer[4]));
        console.log(lightness/10);
        MBlockly.Control.PromiseList.receiveValue(this.buffer[this.SETTING.READ_BYTES_INDEX], lightness/10);
    } else {
        this.out('end');
    }
};

MBlockly.Control.onTopButton_callback = function() {
    console.log('--ontopbutton callback: '+this.buffer.join(','));

    if(this.buffer[0] == 0xff && this.buffer[1] == 0x55) {
        if(this.buffer[6] == 0){
            pressed = 1;
        }
        else{
            pressed = 0;
        }
        console.log('pressed: '+this.buffer[6]);
        MBlockly.Control.PromiseList.receiveValue(this.buffer[this.SETTING.READ_BYTES_INDEX], pressed);
    } else {
        this.out('end');
    }
};

/**
 * Get ultrasonic sensor's value.
 */
MBlockly.Control.ultrasoinic = function(slot, index) {
    var type = this.SETTING.DEV_ULTRASOINIC;
    var port = this.SETTING.PORT_ULTRASOINIC;
    this.buildModuleRead(type, port, slot, index);
};

/**
 * Get linefollow sensor's value.
 */
MBlockly.Control.lineFollow = function(slot, index) {
    var type = this.SETTING.DEV_LINEFOLLOWER;
    var port = this.SETTING.PORT_LINEFOLLOWER;
    this.buildModuleRead(type, port, slot, index);
};

/**
 * Get light sensor's value.
 */
MBlockly.Control.lightSensor = function(slot, index) {
    var type = this.SETTING.DEV_LIGHTSENSOR;
    var port = this.SETTING.PORT_LIGHTSENSOR;
    this.buildModuleRead(type, port, slot, index);
};

/**
 * Get onTopButton's value on mbot.
 */
MBlockly.Control.onTopButton = function(slot, index){
    var type = this.SETTING.DEV_TOPBUTTON;
    var port = this.SETTING.PORT_TOPBUTTON;
    this.buildModuleRead(type, port, slot, index);
};

/**
 * Set motor speed.
 * @param {number} leftSpeed left speed value.
 * @param {number} rightSpeed right speed value.
 */
MBlockly.Control.setSpeed = function(leftSpeed, rightSpeed) {
    var that = this;
    if(leftSpeed!=0 && rightSpeed!=0){
        this.isMotorMoving = true;
    }
    else{
        this.isMotorMoving = false;
    }
    this.buildModuleWriteShort(this.SETTING.DEV_DCMOTOR, this.SETTING.PORT_M1, this.SETTING.SLOT_1, leftSpeed);
    setTimeout(function() {
       that.buildModuleWriteShort(that.SETTING.DEV_DCMOTOR, that.SETTING.PORT_M2, that.SETTING.SLOT_1, rightSpeed);
    }, 50);
};

/**
 * Mbot led position list.
 */
MBlockly.Control.LedPosition = {
    LEFT: 1,
    RIGHT: 2,
    BOTH: 0
};

/**
 * Set Led color.
 * @param {number} red red number.
 * @param {number} green green number.
 * @param {number} blue blue number.
 * @param {number} position position value, 1 means left, 2 means right, 0 means both.
 */
MBlockly.Control.setLed = function(red, green, blue, position) {
    var that = this;
    setTimeout(function() {
        that.setLedByPosition(red, green, blue, position);
    }, 100);
    if(position == 1) {
        this.setLedByPosition(0, 0, 0, this.LedPosition.RIGHT);
    } else if(position == 2) {
        this.setLedByPosition(0, 0, 0, this.LedPosition.LEFT);
    }
};

MBlockly.Control.setLedByPosition = function(red, green, blue, position){
    var type = 8;
    var port = 7;
    var slot = 1;
    console.log(position);
    red = parseInt(red/this.SETTING.RGB_BRIGHTNESS);
    green = parseInt(green/this.SETTING.RGB_BRIGHTNESS);
    blue = parseInt(blue/this.SETTING.RGB_BRIGHTNESS);

    this.buildModuleWriteRGB(type, port, slot, position, red, green, blue);
};

var i = 0;

MBlockly.Control.buzzer = function() {
    if(i > this.SETTING.TONE_HZ.length - 1) {
        i = 0;
    }
    var hz = this.SETTING.TONE_HZ[i];
    i++;
    this.playBuzzer(hz);
};

MBlockly.Control.playTone = function(toneName){
    if(toneName in this.ToneHzTable){
        this.playBuzzer(this.ToneHzTable[toneName]);
    }
};

MBlockly.Control.playBuzzer = function(hz){
    var that = this;
    this.buildModuleWriteBuzzer(hz);

    setTimeout(function() {
        that.stopBuzzer();
    }, 300);
};

MBlockly.Control.stopBuzzer = function() {
    this.buildModuleWriteBuzzer(0);
};

MBlockly.Control.stopSpeed = function() {
    this.setSpeed(0, 0);
};

MBlockly.Control.stopLed = function() {
    this.setLed(0,0,0);
};

// Stop all control command.
MBlockly.Control.stopAll = function() {
    var that = this;
    this.stopSpeed();
    setTimeout(function() {
        that.stopBuzzer();
    }, 100);
    setTimeout(function() {
        that.stopLed();
    }, 100);
    setTimeout(function() {
        MBlockly.Action.stopUltrasoinic();
    }, 100);
    setTimeout(function() {
        MBlockly.Action.stopLineFollow();
    }, 100);
};

MBlockly.Control.deviceEventList = {
    shake: [],
    when_tablet_tilt_forward: [],
    when_tablet_tilt_backward: [],
    when_tablet_tilt_left: [],
    when_tablet_tilt_right: [],
    when_obstacle_ahead: [],
    when_receieve_light: [],
    when_button_on_top_pressed: []
};

MBlockly.Control.DeviceEventWatchdog = {
    // polling interval
    WATCH_INTERVAL: 500,
    OBSTACLE_THRESHOLD: 20,
    LIGHTSENSOR_THRESHOLD: 80,
    lastLightSensorValue: 128,
    timer: null,
    // task queue of reading sensor's value
    taskQueue: []
};

// Watchdog，lisening blocks contain 'when'
MBlockly.Control.DeviceEventWatchdog.activate = function(){
    if(!this.timer){
        this.timer = setInterval(MBlockly.Control.DeviceEventWatchdog.onTimer,
                                    this.WATCH_INTERVAL);
    }
};

MBlockly.Control.DeviceEventWatchdog.onTimer = function(){
    if(MBlockly.Control.DeviceEventWatchdog.taskQueue.length == 0){
        MBlockly.Control.DeviceEventWatchdog.onTaskQueueEmpty();
    }
    else{
        var front = MBlockly.Control.DeviceEventWatchdog.taskQueue.shift();
        if(MBlockly.Control.bluetoothConnected){
            // call the real function eg. getLightSensorValue()
            front[0](front[1]);
        }
    }
};

MBlockly.Control.DeviceEventWatchdog.onTaskQueueEmpty = function(){
    for(var eventType in MBlockly.Control.deviceEventList){
        var callbackList = MBlockly.Control.deviceEventList[eventType];
        if(callbackList.length>0){
            if(eventType == 'when_receieve_light'){
                this.taskQueue.push([MBlockly.Control.getLightSensorValue,
                    (function(callbackList){
                            return function(value){
                                if(value > MBlockly.Control.DeviceEventWatchdog.LIGHTSENSOR_THRESHOLD){
                                    for(var i=0;i<callbackList.length;i++){
                                        callbackList[i]();
                                    }
                                }
                                MBlockly.Control.DeviceEventWatchdog.lastLightSensorValue = value;
                            };
                    })(callbackList)
                ]);
            }
            if(eventType == 'when_button_on_top_pressed'){
                this.taskQueue.push([MBlockly.Control.getOnTopButtonValue,
                    (function(callbackList){
                        return function(value){
                            if(value){
                                for(var i=0;i<callbackList.length;i++){
                                    callbackList[i]();
                                }
                            }
                        };
                    })(callbackList)
                ]);
            }
            if(eventType == 'when_obstacle_ahead'){
                this.taskQueue.push([MBlockly.Control.getUltrasonicValue,
                    (function(callbackList){
                        return function(value){
                            if(value < MBlockly.Control.DeviceEventWatchdog.OBSTACLE_THRESHOLD){
                                for(var i=0;i<callbackList.length;i++){
                                    callbackList[i]();
                                }
                            }
                        };
                    })(callbackList)
                ]);
            }
        }
    }
};

MBlockly.Control.DeviceEventWatchdog.deactivate = function(){
    if(MBlockly.Control.DeviceEventWatchdog.timer){
        clearInterval(MBlockly.Control.DeviceEventWatchdog.timer);
        MBlockly.Control.DeviceEventWatchdog.timer = null;
    }
};

MBlockly.Control.addDeviceEventListener = function(type, handler){
    MBlockly.Control.deviceEventList[type].push(handler);
    MBlockly.Control.DeviceEventWatchdog.activate();
};

MBlockly.Control.clearAllDeviceEventListeners = function(){
    MBlockly.Control.DeviceEventWatchdog.deactivate();
    for(var i in MBlockly.Control.deviceEventList){
        MBlockly.Control.deviceEventList[i] = [];
    }
};

function callback4DataStore(type, state, data) {
    console.log(type);
    switch(type) {
        case 'query':
            MBlockly.Data.fetchData_callback(state, data);
            break;
        case 'delete':
            MBlockly.Data.deleteData_callback(state, data);
            break;
        case 'update':
            MBlockly.Data.updateData_callback(state, data);
        case 'clear':
            MBlockly.Data.clearData_callback(state, data);
            break;
        default:
            break;
    }
}

function callback4Js(string) {
    var data = decodeURIComponent(string);
    MBlockly.Control.decodeData(data);
}

var mStatus = 0;
function getMakeblockAppStatus() {
	chrome.runtime.sendMessage({message: "STATUS"}, function (response) {
		if (response === undefined) { //Chrome app not found
			console.log("Chrome app not found");
			mStatus = 0;
        	MBlockly.Control.bluetoothConnected = false;
			setTimeout(getMakeblockAppStatus, 1000);
		}
		else if (response.status === false) { //Chrome app says not connected
			mStatus = 1;
        	MBlockly.Control.bluetoothConnected = false;
			setTimeout(getMakeblockAppStatus, 1000);
		}
		else { // successfully connected
			if (mStatus !== 2) {
				console.log("successfully connected");
				MBlockly.Control.bluetoothConnected = true;
				MBlockly.Control.bleLastTimeConnected = true;
				chrome.runtime.onMessage.removeListener(onMessage);
				chrome.runtime.onMessage.addListener(onMessage);
			}
			mStatus = 2;
			setTimeout(getMakeblockAppStatus, 1000);
		}
	});
}

getMakeblockAppStatus();
function onMessage(request, sender, sendResponse) {
	if(request.action=="request"){
		MBlockly.Control.decodeData(request.buffer);
	}else{
		//deviceNotify(request.action);
	}
    var resp = {};
    resp.request = request;
    sendResponse(resp);
}

// called by native
function deviceNotify(message){
    console.log(message);
    var runListenerList = function(listenerList){
        for(var i=0;i<listenerList.length;i++){
            listenerList[i]();
        }
    };
    if(message == 'shake'){
        MBlockly.Control.tabletLastShakeTime = (new Date()).getTime()/1000;
        runListenerList(MBlockly.Control.deviceEventList.shake);
    }
    else if(message == 'bleconnect'){
        MBlockly.Control.bluetoothConnected = true;
        MBlockly.Control.bleLastTimeConnected = true;
    }
    else if(message == 'bledisconnect'){
        MBlockly.Control.bluetoothConnected = false;
    }
    else if(message.substring(0,4)== 'tilt'){
        var command = message.split(',');
        MBlockly.Control.tabletTiltLeftRightStatus = command[1];
        MBlockly.Control.tabletTiltForwardBackwardStatus = command[2];
        // if(command[1] == -1){
        //     runListenerList(MBlockly.Control.deviceEventList.when_tablet_tilt_left);
        // }
        // if(command[1] == 1){
        //     runListenerList(MBlockly.Control.deviceEventList.when_tablet_tilt_right);
        // }
        // if(command[2] == -1){
        //     runListenerList(MBlockly.Control.deviceEventList.when_tablet_tilt_backward);
        // }
        // if(command[2] == 1){
        //     runListenerList(MBlockly.Control.deviceEventList.when_tablet_tilt_forward);
        // }
    }
}

MBlockly.Control.decodeData = function(bytes) {
    //var bytes = data.split(" ");
    //console.log('== Received: '+data);

    for(var i = 0; i < bytes.length; i++) {
        this.buffer.push(bytes[i]);
        var length = this.buffer.length;
        if(length>1 && this.buffer[length-2] == this.SETTING.READ_CHUNK_SUFFIX[0] &&
                  this.buffer[length-1] == this.SETTING.READ_CHUNK_SUFFIX[1]) {
            if(this.buffer.length != 10) {
                // this.buffer = [];
            } else {
                var dataIndex = this.buffer[this.SETTING.READ_BYTES_INDEX];
                var promiseType = this.PromiseList.getType(dataIndex);
                if(promiseType == this.PromiseType.LINEFOLLOW) {
                    this.lineFollow_callback();
                }
                else if(promiseType == this.PromiseType.ULTRASONIC) {
                    this.ultrasoinic_callback();
                }
                else if(promiseType == this.PromiseType.LIGHTSENSOR) {
                    this.lightSensor_callback();
                }
                else if(promiseType == this.PromiseType.ON_TOP_BUTTON){
                    this.onTopButton_callback();
                }
            }
            this.buffer = [];
        }
    }
};

MBlockly.Control.getResponseValue = function(b1, b2, b3, b4) {
    var intValue = this.fourBytesToInt(b1,b2,b3,b4);
    var result = parseFloat(this.intBitsToFloat(intValue).toFixed(2));
	console.log(result);
    return result;
};

MBlockly.Control.fourBytesToInt = function(b1,b2,b3,b4 ) {
    return ( b1 << 24 ) + ( b2 << 16 ) + ( b3 << 8 ) + b4;
};

MBlockly.Control.intBitsToFloat = function(num) {
    /* s(sign), e(exponent), m(mantissa) */
    s = ( num >> 31 ) == 0 ? 1 : -1,
    e = ( num >> 23 ) & 0xff,
    m = ( e == 0 ) ?
    ( num & 0x7fffff ) << 1 :
    ( num & 0x7fffff ) | 0x800000;
    return s * m * Math.pow( 2, e - 150 );
};

MBlockly.Control.out = function(msg) {
    var s = $('#log').html() + '<br>' + msg;
    $('#log').html(s);
};