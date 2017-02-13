function BufferLoader(context, urlList) {
  "use strict";
  this.context = context;
  this.urlList = urlList;
  this.bufferList = new ArrayBuffer(0);
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  "use strict";
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";
  request.onload = function() {
    bufferLoader.context.decodeAudioData(
      request.response,
      function onSuccess(buffer) { bufferLoader.bufferList[index] = buffer; },
      function onFailure() { alert("Decoding the audio buffer failed"); }
    );
    request.onload = null;
    request = null;
  };
  request.send();
};

BufferLoader.prototype.load = function() {
  "use strict";
  for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
};

function playSound(i) {
  if (enableSound[i]) {
    var source = context.createBufferSource();
    source.buffer = bufferLoader.bufferList[i];
    var gainNode = context.createGain();
    source.connect(gainNode);
    gainNode.gain.value = soundsVolume[i] * generalVolume;
    gainNode.connect(context.destination);
    source.start(0);
    // console.log(i);
    source.onended = function() {
      onEnd(i);
    };
    source = null;
    gainNode = null;
  }
}

function onEnd(i) {
  if (i == 14) {
    broadcast('scroll');
  }
}

function broadcast(msg) {
  chrome.tabs.query({}, function(tabs) {
    var message = msg;
    for (var i = 0; i < tabs.length; ++i) {
      chrome.tabs.sendMessage(tabs[i].id, message);
    }
  });
}

var context = new AudioContext();
var bufferLoader = new BufferLoader(context, [
  'sounds/1_annoying.wav', // 0 regular keys
  'sounds/1_exclamation.wav', // 1 link
  'sounds/1_high_quick.wav', // 2 click
  'sounds/1_low.wav', // 3 tab removed
  'sounds/1_mid_high.wav', // 4 tab created
  'sounds/1_mid_long.wav', // 5 out of focus
  'sounds/1_mid_quick.wav', // 6 active tab changed
  'sounds/2_bing_bong.wav', // 7 space key
  'sounds/2_bing_boom.wav', // 8 enter key
  'sounds/2_high.wav', // 9 load
  'sounds/2_high_low_fast.wav', // 10 delete key
  'sounds/2_high_low_slow.wav', // 11 lonely
  'sounds/3_annoying.wav', // 12 lonely
  'sounds/3_forceful.wav',
  // 'sounds/3_long_ones.wav', // 14 scroll
  'sounds/2_scroll.wav', // 14 scroll
  'sounds/3_low_high.wav',
  'sounds/3_quiet.wav', // 16 lonely
  'sounds/3_slow.wav',
  'sounds/4_fast.wav', // 18 lonely
  // 'sounds/4_slow.wav',
  // 'sounds/5_bing_bang_boom.wav',
  // 'sounds/7_bing_bong_bing.wav',
  // 'sounds/8_bing.wav'
]);
bufferLoader.load();
var soundsVolume = new Array(bufferLoader.urlList.length);
var enableSound = new Array(bufferLoader.urlList.length);
var generalVolume;

if (localStorage.volume === undefined) {
  localStorage.volume = 50;
}

for (var i = 0; i < bufferLoader.urlList.length; i++) {
  if (localStorage.getItem(i) === null) {
    localStorage.setItem(i, 1);
  }
  if (localStorage.getItem("sound" + i) === null) {
    localStorage.setItem("sound" + i, true);
  }
}
changeSettings("");

function changeSettings(request) {
  for (var i = 0; i < soundsVolume.length; i++) {
    soundsVolume[i] = localStorage.getItem(i);
    enableSound[i] = JSON.parse(localStorage.getItem("sound" + i));
  }
  generalVolume = localStorage.volume / 100;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // console.log(request);
  switch (request) {

    case 'load':
      playSound(9);
      break;

    case 'scroll':
      playSound(14);
      break;

    case 'click':
      playSound(2);
      break;

    case 'link':
      playSound(1);
      break;

    case 'key':
      playSound(0);
      break;

    case 'delete':
      playSound(10);
      break;

    case 'enter':
      playSound(8);
      break;

    case 'space':
      playSound(7);
      break;

  }
});

var addRemoved = false;
chrome.tabs.onCreated.addListener(function(tab) {
  addRemoved = true;
  // console.log('tab created');
  playSound(4);
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  addRemoved = true;
  // console.log('tab removed');
  playSound(3);
});

var tabChanged = false;
chrome.tabs.onActivated.addListener(function(activeInfo) {
  tabChanged = true;
  // console.log('tab changed');
  if (addRemoved) {
    addRemoved = false;
  } else {
    playSound(6);
  }
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
  // console.log('window changed');
  if (windowId != -1) {
    lonely(false);
    if (tabChanged) {
      tabChanged = false;
    } else {
      if (!addRemoved) {
        playSound(6);
      }
    }
  } else {
    lonely(true);
    playSound(5);
  }
});

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var lonelySounds = [11, 12, 16, 18];
var lonelyTimeout;

function lonely(bool) {
  var sound = lonelySounds[randInt(0, lonelySounds.length)];

  function sayHi() {
    playSound(sound);
    lonely(true);
  }
  
  if (bool) {
    var delay = randInt(30000, 240000);
    // console.log('will play sound ' + sound + ' in ' + delay);
    lonelyTimeout = setTimeout(sayHi, delay);
  } else {
    clearTimeout(lonelyTimeout);
  }
}
