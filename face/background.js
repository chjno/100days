var faceHtml = chrome.extension.getURL('face/index.html');
var face;
// var face = window.open(faceHtml, '')
// var face = window.open(faceHtml, '', 'width=320, height=262');
chrome.windows.create({url: faceHtml}, function (win){
  faceId = win.id;
});

var displays = [];
chrome.system.display.getInfo(function (ds){
  for (var display of ds){
    display.bounds.right = display.bounds.left + display.bounds.width;
    display.bounds.bottom = display.bounds.top + display.bounds.height;
    displays.push(display.bounds);
  }
});

var originalWins = undefined;
var prevWins = {};
var faceId;
var minimized = false;
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  // faceId = sender.tab.id;
  console.log(msg.info);
  if (msg.face){
    // x: 0-440
    // y: 0-280
    // width/height: 100-305

    var ratio = {
      x: 1 - msg.info.x / 440,
      y: msg.info.y / 280,
      wh: 1 - (msg.info.width - 100) / 205
    };

    chrome.windows.getAll({}, function (winArr){
      if (!originalWins){
        originalWins = winArr;
      }
      for (var win of winArr){
        if (win.id != faceId){
          var prev;
          if (prevWins.hasOwnProperty(win.id)){
            prev = prevWins[win.id];
          }
          
          for (var display of displays){
            if (win.left >= display.left && win.left <= display.left + display.width &&
              win.top >= display.top && win.top <= display.top + display.height){
                
                newWidth = display.width * ratio.wh;
                newHeight = display.height * ratio.wh;

                // maxLeft = display.right - newWidth;
                // maxTop = display.bottom - newHeight;

                var params;
                if (prev){
                  newLeft = Math.round((prev.width - newWidth) / 2);
                  newTop = Math.round((prev.width - newHeight) / 2);

                  params = {
                    left: Math.round(newLeft),
                    top: Math.round(newTop),
                    width: Math.round(newWidth),
                    height: Math.round(newHeight)
                  };
                  
                } else {
                  params = {
                    width: Math.round(newWidth),
                    height: Math.round(newHeight)
                  };
                }


                prevWins[win.id] = win;
                chrome.windows.update(win.id, params);

                break;
            }
          }
        } else {
          if (!minimized){
            var params = {
              left: displays[0].right - 1,
              top: displays[0].bottom - 1,
              focused: false
            };
            chrome.windows.update(faceId, params);
            minimized = true;
          }
        }
      }
    });

  } else {
    for (var win of originalWins){
      var params = {
        left: win.left,
        top: win.top,
        width: win.width,
        height: win.height
      };
      chrome.windows.update(win.id, params);
    }
    originalWins = undefined;
  }
});







// var speechWin = chrome.extension.getURL('speech.html');
// var opened = false;

// if (!('webkitSpeechRecognition' in window)) {
//   console.log('no webkitSpeechRecognition in window');
// } else {
//   var recognition = new webkitSpeechRecognition();
//   recognition.continuous = true;
//   recognition.interimResults = false;
  
//   recognition.onstart = function() {
//     console.log('recognition start');
//   };

//   recognition.onerror = function(event) {
//     console.log('error', event);
//     if (!opened){
//       face = window.open(faceHtml, '', 'width=320, height=262');
//       opened = true;
//     }
//   };

//   recognition.onend = function() {
//     recognition.start();
//     console.log('recognition end');
//   };

//   recognition.onresult = function(event) {
//     console.log(event);
//     var text = '';
//     for (var i = event.resultIndex; i < event.results.length; ++i) {
//       if (event.results[i].isFinal) {
//         text = event.results[i][0].transcript;
//       }
//     }
//     text = $.trim(text);
//     voiceCommand(text);
//   };

//   recognition.start();
// }

// function voiceCommand(text){
//   console.log(text);
// }