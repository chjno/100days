chrome.runtime.sendMessage({type: 'getCoords'});

////////////////////////////////////////////////////////////
// make sure default cursor/scrolling is disabled
////////////////////////////////////////////////////////////

var mouseZ = 0;
function observe(){

  var observer = new MutationObserver(function (mutations) {
    try{
      document.body.style.overflow = "hidden";
      document.body.style.cursor = 'none';
    } catch(e){}

    mutations.forEach(function (mutation) {
      $(mutation.addedNodes).each(function (){
        if (this instanceof HTMLElement){
          var index = parseInt($(this).css("zIndex"), 10);
          if (index > mouseZ) {
            mouseZ = index + 1;
            cursorDiv.style.zIndex = mouseZ;
          }
        }
      });
    });
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
    try{
      this.style.cursor = 'none';
    } catch(e){}
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
// cursorDiv.style.top = $(window).scrollTop() + $(window).height() / 2 + 'px';
// cursorDiv.style.left = $(window).scrollLeft() + $(window).width() / 2 + 'px';
cursorDiv.style.width = '25px';
cursorDiv.style.height = '25px';
cursorDiv.style.display = 'block';
cursorDiv.style.left = $(window).width() / 2 + 'px';
cursorDiv.style.top = $(window).height() / 2 + 'px';
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


var currentEl;
function underCursor(){
  var pngOffsetX = 7;
  var pngOffsetY = 2;
  var x = $(cursorDiv).offset().left - $(window).scrollLeft() + pngOffsetX;
  var y = $(cursorDiv).offset().top - $(window).scrollTop() + pngOffsetY;

  cursorDiv.style.display = 'none';
  var els = document.elementsFromPoint(x, y);
  var overA = false;
  for (var i = 0; i < els.length; i++){
    if (els[i].tagName == 'A'){
      overA = true;
      currentEl = els[i];
      break;
    }
  }

  if (overA){
    cursor('hand');
  } else {
    cursor('pointer');
    currentEl = document.elementFromPoint(x, y);
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
var moving = false;
var scrolling = false;
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  // console.log(msg);

  if (msg.type == 'unlock'){
    moving = false;
    scrolling = false;

  } else if (msg.type == 'click'){
    // console.log(msg.button);
    if (msg.button == 'l'){
      console.log('click ' + currentEl.tagName);
      if (currentEl.tagName == 'A'){
        chrome.runtime.sendMessage({type: 'openLink', url: currentEl.href});
      } else {
        currentEl.click();
      }
    } else if (msg.button == 'r') {

    }
    
  } else if (msg.type == 'coords'){

    try{
      cursorDiv.style.left = msg.coords.x + 'px';
      cursorDiv.style.top = msg.coords.y + 'px';
    } catch(e){}

  } else if (msg.type == 'mouse'){
    delts['x'] = msg.dx;
    delts['y'] = msg.dy;
    if (!moving){
      moving = true;
      moveMouse();
    }

  } else if (msg.type == 'scroll'){
    delts['x'] = msg.dx;
    delts['y'] = msg.dy;
    if (!scrolling){
      scrolling = true;
      scrollPage();
    }
  }
});

function moveMouse(){
    var currentX = parseFloat(cursorDiv.style.left);
    var currentY = parseFloat(cursorDiv.style.top);
    var newX = currentX + delts['x'];
    var newY = currentY + delts['y'];

    var winWidth = $(window).width();
    var winHeight = $(window).height();
    var winLeft = $(window).scrollLeft();
    var winTop = $(window).scrollTop();

    if (currentX > winWidth){
      newX = winWidth;
    } else if (currentX < 0){
      newX = 0;
    }

    if (currentY > winHeight){
      newY = winHeight;
    } else if (currentY < 0){
      newY = 0;
    }

    cursorDiv.style.left = newX + 'px';
    cursorDiv.style.top = newY + 'px';

    // console.log(newX, newY);


    underCursor();

    chrome.runtime.sendMessage({
      type: 'coords',
      coords: {
        x: newX,
        y: newY
      }
    });

  if (moving){
    setTimeout(moveMouse, 10);
  }
}

function scrollPage(){
  scrollBy(delts['x'], delts['y']);
  if (scrolling){
    setTimeout(scrollPage, 10);
  }
}

$(window).scroll(function (e){
  underCursor();
});
