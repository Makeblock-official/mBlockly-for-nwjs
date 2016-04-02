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

        //自定义协议
        protocol: 'com.xeecos.blockly://demo?',
        CODE_COMMON: [0xff, 0x55, 0],
        READ_CHUNK_PREFIX: [255, 85],
        READ_CHUNK_SUFFIX: [13, 10],
        READ_BYTES_INDEX: 2,

        //设备类型
        DEV_VERSION: 0,
        DEV_ULTRASOINIC: 1,  //超声波
        DEV_TEMPERATURE: 2,
        DEV_LIGHTSENSOR: 31,    // changed from 3 to 31
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
        DEV_LINEFOLLOWER: 17,  // 巡线
        DEV_BUTTON: 18,
        DEV_TOPBUTTON: 31,
        DEV_LIMITSWITCH: 19,
        DEV_PINDIGITAL: 30,
        DEV_PINANALOG: 31,
        DEV_PINPWM: 32,
        DEV_PINANGLE: 33,
        TONE: 34,

        SLOT_1: 1, //0
        SLOT_2: 2, //1

        READMODULE: 1,
        WRITEMODULE: 2,

        VERSION_INDEX: 0xFA,

        //端口：1，2，3，4对应四个大的端口
        //5，6，7，8需要看下位机的固件代码
        //M1，M2白色的端口，上面有文字
        PORT_NULL: 0,
        PORT_1: 1,
        PORT_2: 2,
        PORT_3: 3,
        PORT_4: 4,
        PORT_5: 5,
        PORT_6: 6,
        PORT_7: 7,
        PORT_8: 8,
        PORT_M1: 9,
        PORT_M2: 10,

        //说明书上:超声波4，巡线2
        PORT_ULTRASOINIC:  3,  //超声波port
        PORT_LINEFOLLOWER: 2,  //巡线port
        PORT_LIGHTSENSOR: 6,  //光线传感器port
        PORT_TOPBUTTON: 7,

        //巡线：需要手机端控制
        MSG_VALUECHANGED: 0x10,

        tap_duration: 0.4,

        SPEED_START: 100,    //初始速度
        SPEED_MAX:   255,    //最大速度
        SPEED_CHANGE_TURN_PER: 30,  //转弯时候，每次速度变化
        SPEED_CHANGE_PER: 30,  //加速减速时候，每次速度变化

        //小车的工作模式
        MODE_NONE:      0,
        MODE_AUTO:      1,
        MODE_MANUAL:    2,
        MODE_CRUISE:    3,
        MODE_GYRO:      4,
        MODE_SPEED_MAX: 5,


        //RGB
        RGB_BRIGHTNESS: 20,

        // tone
        TONE_HZ: [262,294,330,349,392,440,494]
    }
};

MBlockly.Control.ToneHzTable = {
    "C2":65, "D2":73, "E2":82, "F2":87, "G2":98, "A2":110, "B2":123, "C3":131, "D3":147, "E3":165, "F3":175, "G3":196, "A3":220, "B3":247, "C4":262, "D4":294, "E4":330, "F4":349, "G4":392, "A4":440, "B4":494, "C5":523, "D5":587, "E5":658, "F5":698, "G5":784, "A5":880, "B5":988, "C6":1047, "D6":1175, "E6":1319, "F6":1397, "G6":1568, "A6":1760, "B6":1976, "C7":2093, "D7":2349, "E7":2637, "F7":2794, "G7":3136, "A7":3520, "B7":3951, "C8":4186
};

MBlockly.Control.sendRequest = function(a) {
    var code = a.join(' ');
    if(this.bluetoothConnected){
        //document.location = this.SETTING.protocol + 'type=control&request=' + code;
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
    console.log(type,args);
};


/**
 * build write code
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
    // return a;
    this.sendRequest(a);
};


/**
 * build write code
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
 * build RGB machine code.
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
 * build Buzzer machine code
 * @private
 */
MBlockly.Control.buildModuleWriteBuzzer = function(hz) {
    var a = new Array(10);
    a[0] = this.SETTING.CODE_COMMON[0];
    a[1] = this.SETTING.CODE_COMMON[1];
    a[2] = 0x5;  //后面的数据长度
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
 * build Read code
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
}

MBlockly.Control.ValueWrapper.prototype.toString = function(){
    return this.val;
}

MBlockly.Control.ValueWrapper.prototype.setValue = function(value){
    this.val = value;
}

MBlockly.Control.PromiseList = {        // 用来储存“读取数据”block对数据的请求。在蓝牙返回数据之后设置真实的值
    requestList: new Array(256),
    index: 1
};

MBlockly.Control.PromiseType = {
    ULTRASONIC: 1,
    LINEFOLLOW: 2,
    LIGHTSENSOR: 3,
    ON_TOP_BUTTON: 4
}

MBlockly.Control.PromiseList.add = function(type, callback, valueWrapper){
    this.index++;
    if(this.index > 255){
        this.index = 1;
    }
    this.requestList[this.index] = {type:type, callback: callback, valueWrapper: valueWrapper};
    return this.index;
}

MBlockly.Control.PromiseList.receiveValue = function(index, value){
    if(this.requestList[index]){
        this.requestList[index].valueWrapper.setValue(value);
        this.requestList[index].callback(value);
    }
}

MBlockly.Control.PromiseList.getType = function(index){
    return this.requestList[index].type;
}

MBlockly.Control.getUltrasonicValue = function(callback){
    var valueWrapper = new MBlockly.Control.ValueWrapper();
    var index = MBlockly.Control.PromiseList
                        .add(MBlockly.Control.PromiseType.ULTRASONIC, callback, valueWrapper);
    MBlockly.Control.ultrasoinic(0, index);
    return valueWrapper;
}

MBlockly.Control.getLineFollowValue = function(callback){
    var valueWrapper = new MBlockly.Control.ValueWrapper();
    var index = MBlockly.Control.PromiseList
                        .add(MBlockly.Control.PromiseType.LINEFOLLOW, callback, valueWrapper);
    MBlockly.Control.lineFollow(0, index);
    return valueWrapper;
}

MBlockly.Control.getLightSensorValue = function(callback){
    var valueWrapper = new MBlockly.Control.ValueWrapper();
    var index = MBlockly.Control.PromiseList
                        .add(MBlockly.Control.PromiseType.LIGHTSENSOR, callback, valueWrapper);
    MBlockly.Control.lightSensor(0, index);
    return valueWrapper;
}

MBlockly.Control.getOnTopButtonValue = function(callback){
    var valueWrapper = new MBlockly.Control.ValueWrapper();
    var index = MBlockly.Control.PromiseList
                        .add(MBlockly.Control.PromiseType.ON_TOP_BUTTON, callback, valueWrapper);
    MBlockly.Control.onTopButton(0, index);
    return valueWrapper;
}


MBlockly.Control.LineFollowCode = {
    ON_TRACK: 0,
    TURN_RIGHT: 64,
    TURN_BACK: 128,
    TURN_LEFT: 191
};


//------- 巡线回调执行 ---------
MBlockly.Control.lineFollow_callback = function() {
    // console.log('--linefollow callback: '+this.buffer.join(','));
    if(this.buffer[0] == 0xff && this.buffer[1] == 0x55) {

        var sum = parseInt(this.buffer[7]) + parseInt(this.buffer[6]);
        console.log('--linefollow sum: '+sum)
        MBlockly.Control.PromiseList.receiveValue(this.buffer[this.SETTING.READ_BYTES_INDEX], sum);
    }
};

//------- 超声波回调执行 ---------
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

//------- 光线传感器回调执行 ---------
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

//------- 顶端按钮回调执行 ---------
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
 * 超声波
 */
MBlockly.Control.ultrasoinic = function(slot, index) {
    var type = this.SETTING.DEV_ULTRASOINIC;
    var port = this.SETTING.PORT_ULTRASOINIC;
    this.buildModuleRead(type, port, slot, index);
};


/**
 * line follow
 */
MBlockly.Control.lineFollow = function(slot, index) {
    var type = this.SETTING.DEV_LINEFOLLOWER;
    var port = this.SETTING.PORT_LINEFOLLOWER;
    this.buildModuleRead(type, port, slot, index);
};

/**
 * 光线传感器
 */
MBlockly.Control.lightSensor = function(slot, index) {
    var type = this.SETTING.DEV_LIGHTSENSOR;
    var port = this.SETTING.PORT_LIGHTSENSOR;
    this.buildModuleRead(type, port, slot, index);
};

MBlockly.Control.onTopButton = function(slot, index){
    var type = this.SETTING.DEV_TOPBUTTON;
    var port = this.SETTING.PORT_TOPBUTTON;
    this.buildModuleRead(type, port, slot, index);
}

/**
 * set Speed.
 * @private
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


MBlockly.Control.LedPosition = {
    LEFT: 1,
    RIGHT: 2,
    BOTH: 0
}

/**
 * set Led.
 * @private
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
    var port = 7; //RGB端口
    var slot = 1; //???

    console.log(position)

    red = parseInt(red/this.SETTING.RGB_BRIGHTNESS);
    green = parseInt(green/this.SETTING.RGB_BRIGHTNESS);
    blue = parseInt(blue/this.SETTING.RGB_BRIGHTNESS);

    this.buildModuleWriteRGB(type, port, slot, position, red, green, blue);
}

var i = 0;

//蜂鸣器:发出下一个HZ
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
}

MBlockly.Control.playBuzzer = function(hz){
    var that = this;
    this.buildModuleWriteBuzzer(hz);

    setTimeout(function() {
        that.stopBuzzer();
    }, 300);
}


MBlockly.Control.stopBuzzer = function() {
    this.buildModuleWriteBuzzer(0);
};


MBlockly.Control.stopSpeed = function() {
    this.setSpeed(0, 0);
};


MBlockly.Control.stopLed = function() {
    this.setLed(0,0,0);
};


// stop
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

// 一般用于"when_receive_light"这样的顶层block
// 当设备发生事件（比如iPad晃动、按钮被按下）的时候回调相应的回调函数
MBlockly.Control.deviceEventList = {    // 这里每个条目都是一个事件列表；每个数组里都是回调函数
    shake: [],
    when_tablet_tilt_forward: [],
    when_tablet_tilt_backward: [],
    when_tablet_tilt_left: [],
    when_tablet_tilt_right: [],
    when_obstacle_ahead: [],
    when_receieve_light: [],
    when_button_on_top_pressed: []
};

// 如果有像“当前方有障碍”这样的block存在时，
// watchdog会轮询对应的传感器，询问数值是否超出范围。若超出则调用回调函数。
MBlockly.Control.DeviceEventWatchdog = {
    WATCH_INTERVAL: 500,                // 两次轮询之间的间隔
    OBSTACLE_THRESHOLD: 20,             // 超声波传感器读数有多小才算前方有障碍
    LIGHTSENSOR_THRESHOLD: 80,          // 有多亮才算受到光照
    lastLightSensorValue: 128,
    timer: null,
    taskQueue: []                       // 读取传感器数据的请求先放到队列中，以防通信阻塞
};

// 启动watchdog，一般由前端监测到有"when..."这样的block时
MBlockly.Control.DeviceEventWatchdog.activate = function(){
    if(!this.timer){
        this.timer = setInterval(MBlockly.Control.DeviceEventWatchdog.onTimer,
                                    this.WATCH_INTERVAL);
    }
}

MBlockly.Control.DeviceEventWatchdog.onTimer = function(){
    if(MBlockly.Control.DeviceEventWatchdog.taskQueue.length == 0){
        MBlockly.Control.DeviceEventWatchdog.onTaskQueueEmpty();
    }
    else{
        var front = MBlockly.Control.DeviceEventWatchdog.taskQueue.shift();
        if(MBlockly.Control.bluetoothConnected){
            front[0](front[1]);     // call the real function eg. getLightSensorValue()
        }
    }
}

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
}

MBlockly.Control.DeviceEventWatchdog.deactivate = function(){
    if(MBlockly.Control.DeviceEventWatchdog.timer){
        clearInterval(MBlockly.Control.DeviceEventWatchdog.timer);
        MBlockly.Control.DeviceEventWatchdog.timer = null;
    }
}

MBlockly.Control.addDeviceEventListener = function(type, handler){
    MBlockly.Control.deviceEventList[type].push(handler);
    MBlockly.Control.DeviceEventWatchdog.activate();
}

MBlockly.Control.clearAllDeviceEventListeners = function(){
    MBlockly.Control.DeviceEventWatchdog.deactivate();
    for(var i in MBlockly.Control.deviceEventList){
        MBlockly.Control.deviceEventList[i] = [];
    }
}


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
};


//------- 回调处理 ---------//
function callback4Js(string) {
    var data = decodeURIComponent(string);
    MBlockly.Control.decodeData(data);
};
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
		else {// successfully connected
			if (mStatus !==2) {
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
};
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
};
// 从iOS端回调，
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


/* 解析从小车返回的字节数据 */
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
    /* s 为符号（sign）；e 为指数（exponent）；m 为有效位数（mantissa）*/
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