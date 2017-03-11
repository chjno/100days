var speechWin = chrome.extension.getURL('speech.html');
var opened = false;

if (!('webkitSpeechRecognition' in window)) {
  console.log('no webkitSpeechRecognition in window');
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  
  recognition.onstart = function() {
    console.log('recognition start');
  };

  recognition.onerror = function(event) {
    // console.log(event.error);
    if (!opened){
      window.open(speechWin, '');
      opened = true;
    }
  };

  recognition.onend = function() {
    recognition.start();
    console.log('recognition end');
  };

  recognition.onresult = function(event) {
    // console.log(event);
    var text = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        text = event.results[i][0].transcript;
      }
    }
    text = $.trim(text);
    voiceCommand(text);
  };

  recognition.start();
}

function voiceCommand(text){
  console.log(text);
}