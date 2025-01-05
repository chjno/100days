var timer;
var img = document.createElement('img');
var div = document.createElement('div');
var divZ = 0;

// on resize window
$(function () {
  var resetTimeout;
  $(window).scroll(function (e) {
    clearTimeout(resetTimeout);
    clearTimeout(timer);

    resetTimeout = setTimeout(resetTimer, 500);
  });
});

function init() {
  chrome.runtime.sendMessage({ type: 'init' });
}

function resetTimer() {
  console.log('starting timer');
  timer = setTimeout(burn, 10000);
}

function burn() {
  var scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  chrome.runtime.sendMessage({ type: 'burn', scrollBarWidth: scrollBarWidth });
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log(msg);
  if (msg.type == 'image') {
    img.src = msg.url;
    $(div).css('width', 'calc(100% + ' + msg.scrollBarWidth + 'px)');
  } else {
    if (msg.active) {
      resetTimer();
    } else {
      clearTimeout(timer);
    }
  }
});

$(img).css({
  'pointer-events': 'none',
  'width': '100%',
  'height': '100%',
});

$(div).append(img);
$(div).attr('id', 'burned-image');
$(div).css({
  'position': 'fixed',
  'top': '0',
  'left': '0',
  'width': '100%',
  'height': '100%',
  'opacity': '0.3',
  'pointer-events': 'none'
});

var observer = new MutationObserver(function (mutations) {
  /*
    if div gets overwritten during page load
  */
  if ($('#burned-image').length === 0) {
    $(document.body).append(div);
  }

  /*
    make sure z-index of div is always greatest
  */
  mutations.forEach(function (mutation) {
    $(mutation.addedNodes).each(function () {
      if (this instanceof HTMLElement) {
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
init();
