// on resize window
// variable opacity based on time spent
// can't click links under img

var initTimeout;
$(window).scroll(function (e){
  clearTimeout(initTimeout);
  clearInterval(timeInterval);

  initTimeout = setTimeout(init, 500);
});

var totalTime;
var then;
var timeInterval;

function init(){
  console.log('init');
  totalTime = 0;
  chrome.runtime.sendMessage(totalTime);
  timeInterval = setInterval(checkTime, 2000);
}

function checkTime(){
  totalTime += 2;
  chrome.runtime.sendMessage(totalTime);
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  if (msg.type == 'image'){
    img.src = msg.url;
    console.log(img);
  } else {
    if (msg.active){
      init();
    } else {
      clearInterval(timeInterval);
    }
  }
});

init();

var img = document.createElement('img');
$(img).css({
  'max-width': '100%',
  'max-height': '100%'
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
  'opacity': '0.3'
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