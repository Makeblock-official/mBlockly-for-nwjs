function onOpenScratchX(){
  window.open('http://scratchx.org/?url=http://mbotx.github.io/scratchx-mbot/project.sbx#scratch');
}
//clgdmbbhmdlbcgdffocenbbeclodbndh
function onRefreshHardware(){
  var msg = {};
  msg.action = "initHID";
  chrome.runtime.sendMessage(msg,function(response){
    console.log("initHID:",response);
    msg.action = "initSerial";
    chrome.runtime.sendMessage(msg,function(response){
      console.log("initSerial:",response);
      msg.action = "initBT";
      chrome.runtime.sendMessage(msg,function(response){
        console.log("initBT:",response);
      });
    });
  });
  
}
function onConnectHID(){
  var msg = {};
  msg.action = document.getElementById('connectHID').innerHTML=="Connect"?"connectHID":"disconnectHID";
  msg.deviceId = document.getElementById('hid-device-selector').options[document.getElementById('hid-device-selector').selectedIndex].id;
  chrome.runtime.sendMessage(msg,function(response){
    console.log("hid:",response);
  });
}
function onConnectSerial(){
  var msg = {};
  msg.action = document.getElementById('connectSerial').innerHTML=="Connect"?"connectSerial":"disconnectSerial";
  msg.deviceId = document.getElementById('serial-device-selector').options[document.getElementById('serial-device-selector').selectedIndex].id;
  chrome.runtime.sendMessage(msg,function(response){
    console.log("serial:",response);
    
  });
}
function onConnectBT(){
  var msg = {};
  msg.action = document.getElementById('connectBT').innerHTML=="Connect"?"connectBT":"disconnectBT";
  msg.address = document.getElementById('bt-device-selector').options[document.getElementById('bt-device-selector').selectedIndex].id;
  chrome.runtime.sendMessage(msg,function(response){
    console.log("bt:",response);
  });
}
function onMessage(request, sender, sendResponse){
  var option,i;
    if(request.action=="initHID"){
      if(request.deviceId!==''){
        console.log(request.devices);
        option = document.createElement('option');
        option.text = request.productName+" #"+request.deviceId;
        option.id = request.deviceId;
        document.getElementById('hid-device-selector').options.length = 0;
        document.getElementById('hid-device-selector').options.add(option);
      }
    }else if(request.action=="addHID"){
      if(request.deviceId!==''){
        option = document.createElement('option');
        option.text = request.productName+" #"+request.deviceId;
        option.id = request.deviceId;
        document.getElementById('hid-device-selector').options.add(option);
      }
    }else if(request.action=="initBT"){
      document.getElementById('bt-device-selector').options.length = 0;
      console.log(request.devices);
      if(request.devices.length>0){
        for(i=0;i<request.devices.length;i++){
          option = document.createElement('option');
          option.text = ""+request.devices[i].name+" ( "+request.devices[i].address+" )";
          option.id = request.devices[i].address;
          document.getElementById('bt-device-selector').options.add(option);
        }
      }
    }else if(request.action=="initSerial"){
      document.getElementById('serial-device-selector').options.length = 0;
      if(request.devices.length>0){
        for(i=0;i<request.devices.length;i++){
          option = document.createElement('option');
          option.text = ""+request.devices[i].path+(request.devices[i].displayName?" "+request.devices[i].displayName:"");
          option.id = request.devices[i].path;
          document.getElementById('serial-device-selector').options.add(option);
        }
      }
    }else if(request.action=="connectHID"){
      document.getElementById('connectHID').innerHTML = request.status?'Disconnect':'Connect';
    }else if(request.action=="connectBT"){
      document.getElementById('connectBT').innerHTML = request.status?'Disconnect':'Connect';
    }else if(request.action=="connectSerial"){
      console.log(request.action,request);
      document.getElementById('connectSerial').innerHTML = request.status?'Disconnect':'Connect';
    }
    var resp = {};
    resp.request = request;
    sendResponse(resp);
}
window.onload = function(){
  document.getElementById('connectHID').addEventListener('click', onConnectHID);
  document.getElementById('connectSerial').addEventListener('click', onConnectSerial);
  document.getElementById('connectBT').addEventListener('click', onConnectBT);
  document.getElementById('refresh').addEventListener('click', onRefreshHardware);
  chrome.runtime.onMessage.addListener(onMessage);
  onRefreshHardware();
};