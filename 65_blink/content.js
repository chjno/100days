var tlid = document.createElement('div');
$(tlid).css({
  'backgroundColor': 'black',
  'position': 'fixed',
  'width': '100%',
  'height': '50%',
  'top': '-50%',
  'left': 0
});
var blid = document.createElement('div');
$(blid).css({
  'backgroundColor': 'black',
  'position': 'fixed',
  'width': '100%',
  'height': '50%',
  'top': '100%',
  'left': 0
});
document.body.append(tlid);
document.body.append(blid);

var blinkSpeed = 500;
var blinkPause = 50;

function blink(){
  $(tlid).animate({
    top: 0
  }, blinkSpeed, function() {
    var el = this;
    setTimeout(function (){
      $(el).animate({
        top: '-50%'
      }, blinkSpeed);
    }, blinkPause);
  });

  $(blid).animate({
    top: '50%'
  }, blinkSpeed, function() {
    var el = this;
    setTimeout(function (){
      $(el).animate({
        top: '100%'
      }, blinkSpeed);
    }, blinkPause);
  });

  setTimeout(blink, randInt(0, 30000));
}

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var lidZ = 0;
function getZs(){
  $('body :visible').each(function (){
    var thisZ = this.style.zIndex;
    if (thisZ >= lidZ){
      lidZ = thisZ + 1;
      updateZ();
    }
  });
}

function updateZ(){
  tlid.style.zIndex = lidZ;
  blid.style.zIndex = lidZ;
}

function observe(){
  function process(){
    getZs();
  }

  var timeout;
  function setDelay(){
    clearTimeout(timeout);
    timeout = setTimeout(process, 500);
  }

  var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };

  var observer = new MutationObserver(function (mutations) {
    setDelay();
  });

  observer.observe(document, config);
}

getZs();
setTimeout(blink, randInt(0, 30000));
$(function (){
  observe();
});