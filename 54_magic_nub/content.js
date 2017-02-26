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

  $('a').css('text-decoration', 'none');

  $(menuDiv).append(backDiv, forwardDiv, reloadDiv);
  document.body.appendChild(menuDiv);

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
  var overMenu = false;
  var overA = false;
  var link;
  for (var i = 0; i < els.length; i++){
    if (els[i].className == 'ps-menu-item'){
      overMenu = true;
      currentEl = els[i];
      break;
    } else if (els[i].tagName == 'A'){
      overA = true;
      link = els[i];
      // break;
    }
  }

  if (overMenu){
    cursor('cursor');
    $(currentEl).css({
      'color': 'white',
      'background-color': 'blue'
    });
    for (var j = 0; j < menuItems.length; j++){
      if (menuItems[j].id != currentEl.id){
        $(menuItems[j]).css({
          'color': 'black',
          'background-color': 'lightgray'
        });
      }
    }
    // $('.menu-item').each(function (){
    //   if (this.id == currentEl.id){
    //     $(this).css({
    //       'color': 'white',
    //       'background-color': 'blue'
    //     });
    //   } else {
    //     $(currentEl).css({
    //       'color': 'black',
    //       'background-color': 'lightgray'
    //     });
    //   }
    // });

      
  } else {
    // $('.ps-menu-item').css({
    //   'color': 'black',
    //   'background-color': 'lightgray'
    // });

    if (overA){
      cursor('hand');
      currentEl = link;
    } else {
      cursor('pointer');
      currentEl = document.elementFromPoint(x, y);
    }
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
      console.log(currentEl.className);
      if (currentEl.className == 'ps-menu-item'){
        switch (currentEl.id){
          case 'back':
            window.history.back();
            break;
          case 'forward':
            window.history.forward();
            break;
          case 'reload':
            location.reload();
            break;
        }
      } else {
        $(menuDiv).css({
          'visibility': 'hidden'
        });
        if (currentEl.tagName == 'A'){
          chrome.runtime.sendMessage({type: 'openLink', url: currentEl.href});
        } else {
          console.log('click ' + currentEl);
          currentEl.click();
        }
        
      }
    } else if (msg.button == 'r') {
      console.log('right click');
      var pngOffsetX = 7;
      var pngOffsetY = 2;
      var x = $(cursorDiv).offset().left - $(window).scrollLeft() + pngOffsetX;
      var y = $(cursorDiv).offset().top - $(window).scrollTop() + pngOffsetY;
      $(menuDiv).css({
        'left': x,
        'top': y,
        'visibility': 'visible'
      });
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
  // scrollBy(delts['x'], delts['y']);
  var x = Math.pow(delts['x'], 2);
  var y = Math.pow(delts['y'], 2);
  if (delts['x'] < 0){
    x = -x;
  }
  if (delts['y'] < 0){
    y = -y;
  }
  scrollBy(x, y);
  if (scrolling){
    setTimeout(scrollPage, 10);
  }
}

$(window).scroll(function (e){
  underCursor();
});




var menuDiv = document.createElement('div');
menuDiv.id = 'menu';
$(menuDiv).css({
  'background-color': 'lightgray',
  'width': '200px',
  'position': 'fixed',
  'visibility': 'hidden'
});

var backDiv = document.createElement('div');
var forwardDiv = document.createElement('div');
var reloadDiv = document.createElement('div');
var menuItems = [backDiv, forwardDiv, reloadDiv];

backDiv.id = 'back';
forwardDiv.id = 'forward';
reloadDiv.id = 'reload';

backDiv.className = 'ps-menu-item';
forwardDiv.className = 'ps-menu-item';
reloadDiv.className = 'ps-menu-item';

backDiv.innerHTML = 'Back';
forwardDiv.innerHTML = 'Forward';
reloadDiv.innerHTML = 'Refresh';

$('.ps-menu-item').hover(function (){
  $(this).css({
    'color': 'white',
    'background-color': 'blue'
  });
}, function (){
  $(this).css({
    'color': 'black',
    'background-color': 'lightgray'
  });
});

$('.ps-menu-item').click(function (){
  switch (this.id){
    case 'back':
      window.history.back();
      break;
    case 'forward':
      window.history.forward();
      break;
    case 'reload':
      location.reload();
      break;
  }
});
