/**
 * @copyright 2015 Makeblock
 * @author callblueday
 * @description encapsulation for hardware control command
 */

MBlockly.Action = {
    buffer : [],
    beginCode : [255, 85],
    endCode : [13, 10],
    baseSpeed: 85,
    currentMode: 0,
    timeCount: 0,
    ulTimer: null,   // ultrasoinic timer
    lineTimer: null, // linefollow timer
    flag4Left: 0,
    flag4Right: 0
};

MBlockly.Action.runSpeed = function(speed, dir) {
    var spd1 = -dir * speed;
    var spd2 = dir * speed;
    MBlockly.Control.setSpeed(spd1, spd2);
};

MBlockly.Action.turnSpeed = function(speed, dir) {
    var spd1 = dir * speed;
    var spd2 = dir * speed;
    MBlockly.Control.setSpeed(spd1, spd2);
};

MBlockly.Action.forward = function() {
    var spd1 = -1 * this.baseSpeed;
    var spd2 = 1 * this.baseSpeed;
    MBlockly.Control.setSpeed(spd1, spd2);
};

MBlockly.Action.backForward = function() {
    var spd1 = 1 * this.baseSpeed;
    var spd2 = -1 * this.baseSpeed;
    MBlockly.Control.setSpeed(spd1, spd2);
};

MBlockly.Action.turnLeftLittle = function() {
    var spd1 = -1 * (this.baseSpeed - 30);
    var spd2 = 1 * this.baseSpeed;
    MBlockly.Control.setSpeed(spd1, spd2);
};

MBlockly.Action.turnRightLittle = function() {
    var spd1 = 1 * (this.baseSpeed - 20);
    var spd2 = 1 * (this.baseSpeed - 20);
    MBlockly.Control.setSpeed(spd1, spd2);
};

MBlockly.Action.turnLeftExtreme = function() {
    var spd1 = 1 * (this.baseSpeed - 20);
    var spd2 = 1 * (this.baseSpeed - 20);
    MBlockly.Control.setSpeed(spd1, spd2);
};

MBlockly.Action.turnRightExtreme = function() {
    var spd1 = -1 * (this.baseSpeed - 20);
    var spd2 = -1 * (this.baseSpeed - 20);
    MBlockly.Control.setSpeed(spd1, spd2);
};

MBlockly.Action.clockwiseRotate = function(speed, time) {
    var spd1 = -1 * speed;
    var spd2 = -1 * speed;
    MBlockly.Control.setSpeed(spd1, spd2);

    setTimeout(function() {
        MBlockly.Control.stopSpeed();
    }, time*1000);
};

MBlockly.Action.antiClockwiseRotate = function(speed, time) {
    var spd1 = 1 * speed;
    var spd2 = 1 * speed;
    MBlockly.Control.setSpeed(spd1, spd2);

    setTimeout(function() {
        MBlockly.Control.stopSpeed();
    }, time*1000);
};

MBlockly.Action.playSong = function(toneArray) {
    console.log(toneArray);
    var i = 0, that = this;
    var songTimer = setInterval(function() {
        i++
        if(i >= toneArray.length) {
            clearInterval(songTimer);
            return false;
        } else {
            MBlockly.Control.playBuzzer();
        }
    }, 500);
};

MBlockly.Action.doUltrasoinic = function() {
    var that = this;
    this.ulTimer = setInterval(function() {
        that.timeCount++;
        if(that.timeCount > 10) {
            clearInterval(that.ulTimer);
            that.timeCount = 0;
            return false;
        }
        MBlockly.Control.ultrasoinic(0, 1);
    }, 1000);
};

MBlockly.Action.stopUltrasoinic = function() {
    clearInterval(this.ulTimer);
};

MBlockly.Action.doLineFollow = function() {
    var that = this;
    this.lineTimer = setInterval(function() {
        that.timeCount++;
        if(that.timeCount > 1000) {
            clearInterval(that.lineTimer);
            that.timeCount = 0;
            return false;
        }
        MBlockly.Control.lineFollow(0, 1);
    }, 1000);
};

MBlockly.Action.stopLineFollow = function() {
    clearInterval(this.lineTimer);
};

/**
 * Data callback handler.
 * @param {Buffer} data data sent by hardware such as bluetooth or 2.4G etc.
 */
MBlockly.Action.decodeData = function(data) {
    this.out('== Data Start ==');
    var bytes = data.split(" ");

    for(var i = 0; i < bytes.length; i++) {
        this.buffer.push(bytes[i]);
        if(bytes[i] == 10) {
            if(this.buffer.length != 10) {
                this.buffer = [];
            } else {
                if((this.buffer[4] + this.buffer[5]) == 0) {
                   this.lineFollow_callback();

                } else {
                   this.ultrasoinic_callback();
                }
            }
        }
    }
};

MBlockly.Action.lineFollow_callback = function() {
    this.out('line flollow');

    if(this.buffer[0] == 0xff && this.buffer[1] == 0x55) {
    
        var sum = this.buffer[7] + this.buffer[6];
        if (sum == 0) {
            this.out("forward");
            this.flag4Left = 0;
            this.flag4Right = 0;
            this.forward();
        } else if(sum == 64) {
            this.out("turn right");
            this.flag4Right++;
            this.turnRightLittle();
        } else if(sum == 128) {
            this.out("backward");
            if (this.flag4Left == this.flag4Right) {
                this.backForward();
            } else if (this.flag4Left > this.flag4Right) {
                if (this.flag4Left > 1) {
                    this.flag4Left--;
                }
                this.turnLeftExtreme();
            } else {
                if (this.flag4Right > 1) {
                    this.flag4Right--;
                }
                this.turnRightExtreme();
            }
        } else if(sum == (63 + 128)) {
            this.out("turn left");
            this.flag4Left++;
            this.turnLeftLittle();
        } else {
            this.out("unknow");
        }
    }
};

MBlockly.Action.ultrasoinic_callback = function() {
    this.out('ultrasoinic start');

    if(this.buffer[0] == 0xff && this.buffer[1] == 0x55) {
        this.out(this.buffer[7] + '-' + this.buffer[6] + '-' + this.buffer[5] + '-' + this.buffer[4]);
        var distance = this.getResponseValue(parseInt(this.buffer[7]), parseInt(this.buffer[6]), parseInt(this.buffer[5]), parseInt(this.buffer[4]));
        this.out(distance);
        
        if(distance < 1 || distance > 10) {
            this.out("forward: " + distance);
            MBlockly.Control.setSpeed(-205, 205);
        } 
        else if(distance < 10) {
            this.out("turn right: " + distance);
            MBlockly.Control.setSpeed(-145, -145);
        }
    } else {
        this.out('end');
    }
};

MBlockly.Action.getResponseValue = function(b1, b2, b3, b4) {
    var intValue = this.fourBytesToInt(b1,b2,b3,b4);
    var result = parseFloat(this.intBitsToFloat(intValue).toFixed(2));

    return result;
};

MBlockly.Action.fourBytesToInt = function(b1,b2,b3,b4 ) {
    return ( b1 << 24 ) + ( b2 << 16 ) + ( b3 << 8 ) + b4;
};

MBlockly.Action.intBitsToFloat = function(num) {
    /* s(sign), e(exponent), m(mantissa)*/
    s = ( num >> 31 ) == 0 ? 1 : -1,
    e = ( num >> 23 ) & 0xff,
    m = ( e == 0 ) ?
    ( num & 0x7fffff ) << 1 :
    ( num & 0x7fffff ) | 0x800000;
    return s * m * Math.pow( 2, e - 150 );
};

/* print msg */
MBlockly.Action.out = function(msg) {
    var s = $('#log').html() + '<br>' + msg;
    $('#log').html(s);
};
