// on resize window

$(function (){
  var resetTimeout;
  $(window).scroll(function (e){
    clearTimeout(resetTimeout);
    clearTimeout(timer);

    resetTimeout = setTimeout(resetTimer, 500);
  });
});

function init(){
  chrome.runtime.sendMessage('init');
}

var timer;
function resetTimer(){
  console.log('starting timer');
  timer = setTimeout(burnTime, 15000);
}

function burnTime(){
  chrome.runtime.sendMessage('burn');
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  console.log(msg);
  if (msg.type == 'image'){
    if (!img.src){
      img.src = msg.url;
    }
  } else {
    if (msg.active){
      resetTimer();
    } else {
      clearTimeout(timer);
    }
  }
});

init();

var img = document.createElement('img');
$(img).css({
  'pointer-events': 'none'
});


var div = document.createElement('div');
$(div).append(img);
$(div).attr('id', 'div');
$(div).css({
  'position':'fixed',
  'top':'0',
  'left':'0',
  'width':'100%',
  'height':'100%',
  'opacity': '0.3',
  'pointer-events': 'none'
});
var divZ = 0;


var observer = new MutationObserver(function (mutations) {

  /*
    if div gets overwritten during page load
  */
  if ($('#div').length === 0){
    $(document.body).append(div);
  }

  /*
    make sure z-index of div is always greatest
  */
  mutations.forEach(function (mutation) {
    $(mutation.addedNodes).each(function (){
      if (this instanceof HTMLElement){
        var index = parseInt($(this).css("zIndex"), 10);
        if (index > divZ) {
          divZ = index + 1;
          $(div).css('z-index', divZ);
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