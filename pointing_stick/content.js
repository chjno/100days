function observe(){

  var observer = new MutationObserver(function (mutations) {
    try{
      document.body.style.overflow = "hidden";
      document.body.style.cursor = 'none';
    } catch(e){
        
    }
  });

  var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };

  observer.observe(document, config);
}

observe();

$(function (){
  $('body *').each(function (){
    this.style.cursor = 'none';
  }).click(function (e){
    e.preventDefault();
    // return false;
  }).hover(function (e){
    e.preventDefault();
    // return false;
  });

  document.body.appendChild(cursorDiv);
  underCursor();
});

var cursorDiv = document.createElement('div');
cursorDiv.style.position = 'fixed';
cursorDiv.style.top = $(window).height() / 2 + 'px';
cursorDiv.style.left = $(window).width() / 2 + 'px';
cursorDiv.style.width = '25px';
cursorDiv.style.height = '25px';
cursorDiv.style.display = 'block';
cursorDiv.id = 'ps-cursor';

var pointerSrc = chrome.extension.getURL('img/pointer_small.png');
var handSrc = chrome.extension.getURL('img/hand_small.png');
var pointer = document.createElement('img');
var hand = document.createElement('img');
pointer.style.display = 'none';
hand.style.display = 'none';
pointer.src = pointerSrc;
hand.src = handSrc;

cursorDiv.appendChild(pointer);
cursorDiv.appendChild(hand);

function underCursor(){
  var pngOffsetX = 7;
  var pngOffsetY = 2;
  var x = $(cursorDiv).offset().left - $(window).scrollLeft() + pngOffsetX;
  var y = $(cursorDiv).offset().top - $(window).scrollTop() + pngOffsetY;
  console.log(x, y);

  cursorDiv.style.display = 'none';
  var el = document.elementFromPoint(x, y);
  console.log(el);
  if (el.tagName == 'a'){
    cursor('hand');
  } else {
    cursor('pointer');
  }

  cursorDiv.style.display = 'block';

}

function cursor(type){
  if (type == 'hand'){
    pointer.style.display = 'none';
    hand.style.display = 'block';
  } else {
    pointer.style.display = 'block';
    hand.style.display = 'none';
  }
}

var delts = {
  'x': 0,
  'y': 0
};
var mouseInterval;
var moving = false;
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  // console.log(msg);

  

  if (msg.type == 'unlock'){
    moving = false;
    // clearInterval(mouseInterval);
  } else if (msg.type == 'click'){
    console.log(msg.button);
    if (msg.button == 'l'){
      chrome.tabs.sendMessage(currentTabId, msg);
    } else {
      chrome.tabs.sendMessage(currentTabId, msg);
    }
    
  } else {
    delts['x'] = msg.dx;
    delts['y'] = msg.dy;

    moving = true;
    mouseInterval = setInterval(moveMouse, 1000);

  }
  //   case 'click':
  //     break;
  //   case 'mouse':
  //     console.log(msg.dx, msg.dy);
      
      
  //     break;
  //   case 'scroll':
  //     console.log(msg.dx, msg.dy);
  //     break;
  // }
});

function moveMouse(){
  if (moving){
    cursorDiv.style.left = parseFloat(cursorDiv.style.left) + delts['x'] + 'px';
    cursorDiv.style.top = parseFloat(cursorDiv.style.top) + delts['y'] + 'px';

    if (parseFloat(cursorDiv.style.left) > $(window).width() + $(window).scrollLeft()){
      cursorDiv.style.left = $(window).width() + $(window).scrollLeft() + 'px';
    } else if (parseFloat(cursorDiv.style.left) < $(window).scrollLeft()){
      cursorDiv.style.left = $(window).scrollLeft()  + 'px';
    }

    if (parseFloat(cursorDiv.style.top) > $(window).height() + $(window).scrollTop()){
      cursorDiv.style.top = $(window).height() + $(window).scrollTop()  + 'px';
    } else if (parseFloat(cursorDiv.style.top) < $(window).scrollTop()){
      cursorDiv.style.top = $(window).scrollTop()  + 'px';
    }
  } else {
    clearInterval(mouseInterval);
  }
}
