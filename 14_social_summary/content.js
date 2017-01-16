var streamIds = [];

function init(callback){
  var streams = [document.getElementById('substream_0')];
  streams.push(streams[0].nextSibling);
  for (var i = 0; i < streams.length; i++){
    observeStream(streams[i], callback);
  }

  var pagelet = streams[0].nextSibling.nextSibling.children[0];
  observePagelet(pagelet, callback);
}

function isolateHeaders(stream){
  var headers = $(stream).find('._5x46');

  // remove
  // header sibs, social actions, top right arrows
  var sibs = $(headers).siblings().attr('class', 'toRemove');
  $(stream).find('.toRemove, .commentable_item, ._6a.uiPopover._5pbi._cmw._5v56._b1e').remove();
  // shared/liked, suggested/commented, birthdays, special facebook posts (MLK)
  $(stream).find('._1qbu._5pbw._5vra, ._5g-l, .mbs._4bxd._5pbw._5vra, ._3j6k._5pcr')
           .parents("[id*='hyperfeed_story_id_']").remove();
}

function observePagelet(elt, callback){
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      var streams = $('._4ikz');
      for (var i = 0; i < streams.length; i++){
        if (streamIds.indexOf(streams[i].id) == -1){
          observeStream(streams[i], callback);
          streamIds.push(streams[i].id);
        }
      }
    });
  });

  var config = {
    attributes: true,
    childList: true,
    characterData: true
  };

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
    callback(elt);
    timeout = setTimeout(stopObserving, 500);
  }

  var observer = new MutationObserver(function (mutations) {
    setDelay();
  });

  var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };

  observer.observe(elt, config);
}

init(isolateHeaders);
