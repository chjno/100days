var streamIds = [];
function observePagelet(elt, callback){

  var config = {
    attributes: true,
    childList: true,
    characterData: true
  };

  var observer = new MutationObserver(function (mutations) {
    var streams = document.getElementsByClassName('_4ikz');
    for (var i = 0; i < streams.length; i++){
      if (streamIds.indexOf(streams[i].id) == -1){
        observeStream(streams[i], callback);
        streamIds.push(streams[i].id);
      }
    }
  });

  observer.observe(elt, config);
}

function observeStream(elt, callback){

  function stopObserving(){
    observer.disconnect();
    callback(elt);
  }

  var timeout;
  function setDelay(){
    clearTimeout(timeout);
    timeout = setTimeout(stopObserving, 500);
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

  setDelay();
  observer.observe(elt, config);
}

var main;
function init(callback){
  main = document.getElementById('stream_pagelet');
  main.setAttribute('style', 'position: relative;');

  var streams = [document.getElementById('substream_0')];
  streams.push(streams[0].nextSibling);
  for (var j = 0; j < streams.length; j++){
    observeStream(streams[j], callback);
    streamIds.push(streams[j].id);
  }

  var pagelet = streams[0].nextSibling.nextSibling.children[0];
  observePagelet(pagelet, callback);
}

var randInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

function fuckTrump(stream){
  var avatarTags = ['_s0 _44ma img', 'img UFIActorImage _54ru img', '_s0 _5xib _44ma _54ru img'];

  for (var j = 0; j < avatarTags.length; j++){
    var avatars = document.getElementsByClassName(avatarTags[j]);

    for (var i = 0; i < avatars.length; i++){
      var div = avatars[i];

      if (div.getAttribute('alt') != 'Chino Daniel Daniel'){
        var top = randInt($(window).scrollTop(), $(window).scrollTop() + $(window).height());
        avatars[i].setAttribute('style','position:absolute; top:' + top + 'px; left:' + randInt(0,90) + '%; z-index:1000;');
        main.appendChild(div);
        div.className = 'marcher';
        animateMarcher(div, randInt(2000,7000));
      }
    }
  }

  function animateMarcher(elt, speed){

    function march(){
      $(elt).animate({
        top: '+=' + 200
      }, {
        duration: speed,
        easing: 'linear',
        complete: function(){
          var top;
          if (parseInt($(elt).css('top'), 10) > ($(window).scrollTop() + $(window).height())){
            top = $(window).scrollTop() - 50;
            if (top < 0){
              top = 0;
            }
            $(elt).css('top', top + 'px');
          } else if (parseInt($(elt).css('top'), 10) < $(window).scrollTop()){
            top = $(window).scrollTop() - 50;
            if (top < 0){
              top = 0;
            }
            $(elt).css('top', top + 'px');
          }
          march();
        }
      });
    }

    march();
  }
}

init(fuckTrump);
