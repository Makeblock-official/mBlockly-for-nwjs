chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create(
      "index.html",
      {
        innerBounds: { width: 300, height: 440, minWidth: 300, maxWidth: 300, minHeight: 440, maxHeight: 440 }
      });
});
var devicesCount = 0;
var hidEnabled = false;
var hidConnection;
var hidInterval = 0;
var serialConnection;
var btConnection;
var isFirst = true;
function initBT(){
  var msg = {};
  msg.action = 'initBT';
  chrome.bluetooth.getDevices(function (deviceInfos){
    console.log(deviceInfos);
    msg.devices = deviceInfos;
    sendMessage(msg);
  });
  
}
function initHID(){
  var msg = {};
  msg.action = 'initHID';
  chrome.hid.getDevices({vendorId:0x0416,productId:0xffff},function(devices){
    if (chrome.runtime.lastError) {
      console.log("Unable to enumerate devices: " +
                    chrome.runtime.lastError.message);
      msg.deviceId = '';
      sendMessage(msg);
    }else{
      devicesCount = devices.length;
      if(devicesCount>0){
        msg.deviceId = devices[0].deviceId;
        msg.productName = devices[0].productName;
        msg.devices = devices;
        sendMessage(msg);
      }
    }
  });
  if(isFirst){
    isFirst = false;
    chrome.hid.onDeviceAdded.addListener(onDeviceAdded);
    chrome.hid.onDeviceRemoved.addListener(onDeviceRemoved);
    chrome.bluetoothSocket.onReceive.addListener(onBTReceived);
  }
}
function initSerial(){
  var msg = {};
  msg.action = 'initSerial';
  chrome.serial.getDevices(function(devices){
    if (chrome.runtime.lastError) {
      console.log("Unable to enumerate devices: " +
                    chrome.runtime.lastError.message);
      msg.devices = [];
      sendMessage(msg);
    }else{
      msg.devices = devices;
      sendMessage(msg);
    }
  });
}
function connectBT(address){
  var msg = {};
  msg.action = 'connectBT';
  chrome.bluetoothSocket.create(function(createInfo) {
  chrome.bluetoothSocket.connect(createInfo.socketId,
    address, '1101', function(){
      if (chrome.runtime.lastError) {
        console.log("Connection failed: " + chrome.runtime.lastError.message);
          msg.status = false;
      } else {
        btConnection = createInfo.socketId;
          msg.status = true;
      }
          sendMessage(msg);
    });
});
}

function onBTReceived(info){
  onParseSerial(new Uint8Array(info.data));
}
function connectHID(deviceId){
  var msg = {};
  msg.action = 'connectHID';
  chrome.hid.connect(deviceId*1, function(connectInfo) {
        if (!connectInfo) {
          msg.warn = connectInfo;
          msg.status = false;
          sendMessage(msg);
        }else{
          if(!hidConnection){
            hidConnection = connectInfo.connectionId;
            pollForHID();
          }
          console.log("hid connected:",hidConnection);
          msg.status = true;
          sendMessage(msg);
        }
      });
}
function connectSerial(deviceId){
  var msg = {};
  msg.action = 'connectSerial';
  chrome.serial.connect(deviceId, {bitrate: 115200}, function(connectInfo) {
        if (!connectInfo) {
          msg.warn = connectInfo;
          msg.status = false;
          sendMessage(msg);
        }else{
          if(!serialConnection){
            serialConnection = connectInfo.connectionId;
            chrome.serial.onReceive.addListener(onSerialReceived);
          }
          console.log("serial connected:",serialConnection);
          msg.status = true;
          sendMessage(msg);
        }
      });
}
function onSerialReceived(info){
  onParseSerial(new Uint8Array(info.data));
}
function disconnectBT(){
  var msg = {};
  msg.action = 'connectBT';
  chrome.bluetoothSocket.disconnect(btConnection, function (){
          msg.status = false;
          btConnection = null;
          sendMessage(msg);
  });
}
function disconnectHID(deviceId){
  var msg = {};
  msg.action = 'connectHID';
  clearInterval(hidInterval);
  setTimeout(function(){
  	chrome.hid.disconnect(hidConnection, function() {
          msg.status = false;
          hidConnection = null;
          sendMessage(msg);
      });
    },1000);
}
function disconnectSerial(deviceId){
  var msg = {};
  msg.action = 'connectSerial';
  chrome.serial.disconnect(serialConnection, function() {
          msg.status = false;
          serialConnection = null;
          sendMessage(msg);
      });
}
function sendMessage(msg){
  chrome.runtime.sendMessage(msg,function(response){
    console.log("response:",response);
  });
}
function sendBT(buffer){
  var bytes = new Uint8Array(buffer.length);
  for(var i=0;i<buffer.length;i++){
    bytes[i] = buffer[i];
  }
  chrome.bluetoothSocket.send(btConnection, bytes.buffer, function(bytes_sent) {
    if (chrome.runtime.lastError) {
      console.log("Send failed: " + chrome.runtime.lastError.message);
    } else {
      console.log("Sent " + bytes_sent + " bytes");
    }
  });
}
function sendHID(buffer){
    var bytes = new Uint8Array(buffer.length);
    for(var i=0;i<buffer.length;i++){
      bytes[i] = buffer[i];
    }
    // ui.send.disabled = true;
    chrome.hid.send(hidConnection, 0, bytes.buffer, function() {
    //   ui.send.disabled = false;
    });
}
function sendSerial(buffer){
    var bytes = new Uint8Array(buffer.length);
    for(var i=0;i<buffer.length;i++){
      bytes[i] = buffer[i];
    }
    chrome.serial.send(serialConnection, bytes.buffer, function() {

    });
}
function pollForHID(){
	if(hidConnection!=null){
  		chrome.hid.receive(hidConnection, function(reportId, data) {
			if(hidConnection!=null){
				if(data!=null){
					onParse(new Uint8Array(data));
				}
				hidInterval = setTimeout(pollForHID, 16);
			}
    	});    	
    }
}
function onBTReceived(receiveInfo) {
  if (receiveInfo.socketId == btConnection){
    onParseSerial(new Uint8Array(receiveInfo.data));
  }
    
}
chrome.runtime.onConnectExternal.addListener(onConnected);
chrome.runtime.onMessageExternal.addListener(onMessageExternal);
chrome.runtime.onMessage.addListener(onMessage);
console.log(chrome.runtime.id);
function onMessage(request, sender, sendResponse) {
  if(request.action=="initSerial"){
    initSerial();
  }else if(request.action=="initHID"){
    initHID();
  }else if(request.action=="initBT"){
    initBT();
  }else if(request.action=="connectBT"){
    connectBT(request.address);
  }else if(request.action=="connectHID"){
    connectHID(request.deviceId*1);
  }else if(request.action=="disconnectBT"){
    disconnectBT();
  }else if(request.action=="disconnectHID"){
    disconnectHID(request.deviceId*1);
  }else if(request.action=="connectSerial"){
    connectSerial(request.deviceId);
  }else if(request.action=="disconnectSerial"){
    disconnectSerial(request.deviceId);
  }else if(request.action=="command"){
  
	console.log(request.buffer);
  	onPortMessage(request);
  }
  var resp = {};
  resp.request = request;
  sendResponse(resp);
}
function onMessageExternal(request, sender, sendResponse) {
    var resp = {};
    if(hidConnection===null&&serialConnection===null&&btConnection===null){
      resp.status = false;
      sendResponse(resp);
    }else{
      resp.status = true;
      sendResponse(resp);
    }
}
var currentPort = null;
function onConnected(port){
  console.log("onConnected:",port);
  if(currentPort!==null){
    currentPort.onMessage.removeListener(onPortMessage);
    currentPort.disconnect();
  }
  currentPort = port;
  currentPort.onMessage.addListener(onPortMessage);
}

function onParseSerial(buffer){
    var msg = {};
    msg.action = "request";
    msg.buffer = [];
    for(var i=0;i<buffer.length;i++){
      msg.buffer[i] = buffer[i];
    }
    postMessage(msg);
}
function onParse(buffer){
  if(buffer[0]>0){
    var msg = {};
    msg.action = "request";
    msg.buffer = [];
    for(var i=0;i<buffer[0];i++){
      msg.buffer[i] = buffer[i+1];
    }
    postMessage(msg);
  }
}
function postMessage(msg){
  chrome.runtime.sendMessage(msg,function(response){
  
  });
}
function onPortMessage(msg){
  if(hidConnection){
    sendHID(msg.buffer);
  }
  if(serialConnection){
    sendSerial(msg.buffer);
  }
  if(btConnection){
    sendBT(msg.buffer);
  }
}
function onDeviceAdded(device){
  //HidDeviceInfo 
  console.log("added:"+device);
  var msg = {};
  msg.action = "addHID";
  msg.deviceId = device.deviceId;
  msg.productName = device.productName;
  sendMessage(msg);
}
function onDeviceRemoved(device){
  console.log("removed:"+device);
}
