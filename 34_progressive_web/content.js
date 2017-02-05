var whiteDiv = document.createElement('div');
var whiteZ = 0;
$(whiteDiv).attr('id', 'white-div');
$(whiteDiv).css({
  'position':'absolute',
  'padding':'0',
  'margin':'0',
  'top':'0',
  'left':'0',
  'width':'100%',
  'height':'100%',
  'background':'rgba(255,255,255,1)',
  // 'z-index':'1000000'
});

var preObserver;
var doc = false;
function beforeLoad(){
  preObserver = new MutationObserver(function (mutations) {

    /*
      if whiteDiv gets overwritten during page load
    */
    if ($('#white-div').length === 0){
      $(document.body).append(whiteDiv);
    }

    /*
      make sure z-index of whiteDiv is always greatest
    */
    mutations.forEach(function (mutation) {
      $(mutation.addedNodes).each(function (){
        if (this instanceof HTMLElement){
          var index = parseInt($(this).css("zIndex"), 10);
          if (index > whiteZ) {
            whiteZ = index + 1;
            $(whiteDiv).css('z-index', whiteZ);
          }
        }
      });
    });

    /*
      as page gets longer, extend whiteDiv
    */
    try {
      $(whiteDiv).css('height', $(document).height());
    } catch (e){
      // console.log('doc not ready');
    }
  });

  var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };

  preObserver.observe(document, config);
}

beforeLoad();

$(function() {
  preObserver.disconnect();
  
  var whiteTop = 0;
  var whiteGone = false;
  var whiteTimeout;

  function recedeWhite(){
    var windowTop = $(window).scrollTop();
    var windowHeight = $(window).height();
    var windowBottom = windowTop + windowHeight;

    if (whiteTop < windowBottom){
      whiteGone = false;
      whiteTop += 50;
      blurVisible();
      if (whiteTop - windowTop > windowHeight * .5 && !blurReceding){
        recedeBlur();
        blurReceding = true;
      }
      $(whiteDiv).css('top', whiteTop);

      var whiteDelay = randInt(300, 800);
      whiteTimeout = setTimeout(recedeWhite, whiteDelay);
    } else {
      whiteGone = true;
    }
  }

  /*
    pause receding div on scroll
  */
  $(window).scroll(function (){
    clearTimeout(whiteTimeout);
    clearTimeout(blurTimeout);
    var delay = randInt(300, 800);
    whiteTimeout = setTimeout(recedeWhite, delay);
    blurTimeout = setTimeout(recedeBlur, delay + 2000);
  });

  function onElementHeightChange(elm, callback){
      var lastHeight = elm.clientHeight, newHeight;
      (function run(){
          newHeight = elm.clientHeight;
          if( lastHeight != newHeight )
              callback();
          lastHeight = newHeight;

          if( elm.onElementHeightChangeTimer )
              clearTimeout(elm.onElementHeightChangeTimer);

          elm.onElementHeightChangeTimer = setTimeout(run, 200);
      })();
  }

  /*
    extend whiteDiv on body height change
  */
  onElementHeightChange(document.body, function(){
    $(whiteDiv).css('height', $(document).height());
  });

  /*
    make sure z-index of whiteDiv is always greatest
  */
  function observePage(){
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        $(mutation.addedNodes).each(function (){
          if (this instanceof HTMLElement){
            var index = parseInt($(this).css("zIndex"), 10);
            if (index > whiteZ) {
              whiteZ = index + 1;
              $(whiteDiv).css('z-index', whiteZ);
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

  function blurVisible(){
    $($('body').children()).find(':visible').each(function (){
      if ($(this).height() <= $(window).height() && $(this).offset().top >= blurTop && $(this).offset().top <= whiteTop){
        $(this).css('filter', 'blur(1px)');
      }
    });
  }

  var blurTop = 0;
  var blurReceding = false;
  var blurTimeout
  function recedeBlur(){
    blurReceding = true;
    var visible = $($('body').children()).find(':visible');

    if (whiteTop > blurTop){
      blurTop += 50;
      $(visible).each(function (){
        if ($(this).offset().top < blurTop){
          $(this).css('filter', '');
        }
      });
      var blurDelay = randInt(300, 800);
      blurTimeout = setTimeout(recedeBlur, blurDelay);
    } else {
      blurReceding = false;
    }
  }

  /*
    init
  */
  observePage();
  recedeWhite();
  // var blurTimeout = setTimeout(recedeBlur, 3000);

});

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
