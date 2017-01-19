var checkScrollSpeed = (function(settings){
  settings = settings || {};

  var lastPos, newPos, timer, delta,
      delay = settings.delay || 50; // in "ms" (higher means lower fidelity )

  function clear() {
    lastPos = null;
    delta = 0;
  }

  clear();
  
  return function(){
    newPos = window.scrollY;
    if ( lastPos !== null ){ // && newPos < maxScroll 
      delta = newPos -  lastPos;
    }
    lastPos = newPos;
    clearTimeout(timer);
    timer = setTimeout(clear, delay);
    return delta;
  };
})();

function observePagelet(elt, callback){
  var config = {
    attributes: true,
    childList: true,
    characterData: true
  };

  var observer = new MutationObserver(function (mutations) {
    callback();
  });

  observer.observe(elt, config);
}

var mydiv = document.createElement('div');
var bottom = 0;
$('#pagelet_composer').after(mydiv);
growDiv();

var pagelet = document.getElementById('substream_1').nextSibling.children[0];
observePagelet(pagelet, growDiv);

$(window).scroll(function (){
  growDiv();
});

function growDiv(){
  if (checkScrollSpeed() < 50){
    if ($(window).scrollTop() + $(window).height() - ($(mydiv).offset().top + bottom) > 300){
      bottom = $(window).scrollTop() + $(window).height() - 300;
      mydiv.setAttribute('style', 'height:' + bottom + 'px;');
    }
  }
}
