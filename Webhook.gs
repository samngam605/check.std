  var channelToken = "K+hX6E+f65r0TqeOPVRPp+73yg89Ank7e0zAKsqzx2farK3Vbwf+rHHZCywfXymiASCbWq6O4Ovalq3Q114S1gv6/Op+BPpPIpgbiDuTWTBCuSMQdvURH7s5xLYxGphfQpc4+y9Drz9bTxwl26ALYgdB04t89/1O/w1cDnyilFU=";
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1BkD4cebBUYGNqnl0Mui78_Ms97PA1WoynhS5gNnG_G8/edit");
  var sheet = ss.getSheetByName("Data");
  var sheet1 = ss.getSheetByName("Logx");

  Logger = BetterLog.useSpreadsheet('1BkD4cebBUYGNqnl0Mui78_Ms97PA1WoynhS5gNnG_G8'); 

function replyMsg(replyToken, mess, channelToken) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var opt = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + channelToken,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': mess
    })
  };
  UrlFetchApp.fetch(url, opt);
}


function notiMsg(msg, notitok) {
  var url = 'https://notify-api.line.me/api/notify';
  var opt = {
  'method' : 'post',
  'contentType': 'application/x-www-form-urlencoded',
  'headers':{'Authorization': 'Bearer '+notitok},//1-1
    'payload' : {'message': msg}
};
      UrlFetchApp.fetch(url, opt);
}

function doGet(e) {
  Logger.log("doGet : "+e);
  var code = e.parameter.code;
  var state = e.parameter.state;
  var uid = e.parameter.uid;
  var uname = e.parameter.uname;
  var formData = {
  'grant_type': 'authorization_code',
  'code': code,
  'redirect_uri': 'https://samngam605.github.io/check.std/link.html', //https://notify-bot.line.me/my/services/
  'client_id': 'osZTEGyp8eEwLov8PkgxiX', //https://notify-bot.line.me/my/services/
  'client_secret': 'zGv5UAYYpBVFzezAXDHXLQSWWPzWMs2HoVIBeCucy9q' //https://notify-bot.line.me/my/services/
  };
  var options = {
  'method' : 'post',
  'payload' : formData
  };
  var gettext = UrlFetchApp.fetch('https://notify-bot.line.me/oauth/token', options);
  var profiledata = JSON.parse(gettext.getContentText());
  var tokenn = profiledata.access_token;

var checkid = sheet.getRange(2, 3, sheet.getLastRow(),sheet.getLastColumn()).getValues();
for(var i = 0;i<checkid.length; i++){
 if(state == checkid[i][0]){
   var goodid = true;
   sheet.getRange(i+2,1).setValue(uid);
   sheet.getRange(i+2,2).setValue(uname);
   sheet.getRange(i+2,6).setValue(tokenn);
}
}
if(goodid){
    var result = {"desc": "ลงทะเบียนสำเร็จ"};
  return ContentService.createTextOutput(JSON.stringify(result) ).setMimeType(ContentService.MimeType.JSON); 
}else{
  var result = {"desc": "ลงทะเบียนไม่สำเร็จ/ไม่พบรหัสนักเรียน"};
  return ContentService.createTextOutput(JSON.stringify(result) ).setMimeType(ContentService.MimeType.JSON); 
}
  }

function doPost(e) {
   Logger.log("doPost : "+e);
        var value = JSON.parse(e.postData.contents);
        var events = value.events;
        var event = events[0];
        var type = event.type;
        var replyToken = event.replyToken;
        var sourceType = event.source.type;
        var userId = event.source.userId;
        var groupId = event.source.groupId;
        var timeStamp = event.timestamp;
  Logger.log(type);
        switch (type) {
          case 'follow':
            var mess = [{"type":"text","text":"https://liff.line.me/1656916607-zJo6pPdw"}];
            replyMsg(replyToken, mess, channelToken);
            break;
          case 'message':
            var messageType = event.message.type;
            var messageId = event.message.id;
            var messageText = event.message.text;
            
            
            
            if(messageType == "text"){

var checkid = sheet.getRange(2, 3, sheet.getLastRow(),sheet.getLastColumn()).getValues();
for(var i = 0;i<checkid.length; i++){
 if(messageText == checkid[i][0]){
   var goodnoti = true;
   var stdpaid = sheet.getRange(i+2,2).getValue();
   var stdid = sheet.getRange(i+2,3).getValue();
   var first = sheet.getRange(i+2,4).getValue();
   var last = sheet.getRange(i+2,5).getValue();
   var stdtoken = sheet.getRange(i+2,6).getValue();
}
}
if(goodnoti){
            notiMsg('แจ้งเตือน\nรหัส '+stdid+'\nนักเรียนเข้าเรียนปกติ\nชื่อ '+first+' '+last+'\nผู้ปกครอง '+stdpaid, stdtoken);
            var mess = [{"type":"text","text":"แจ้งเตือนผู้ปกครอง "+first+" "+last+" เรียบร้อย"}];
            replyMsg(replyToken, mess, channelToken);
}else{
  var mess = [{"type":"text","text":"ไม่พบรหัสนักเรียน/รหัสผิด"}];
            replyMsg(replyToken, mess, channelToken);
}


            }
            else{
            //var mess = [{"type":"text","text":"https://liff.line.me/1655620417-5dWDpmLl"}];
            //replyMsg(replyToken, mess, channelToken);
            }
            break;
          default:
            break;
        }
  
  
}
