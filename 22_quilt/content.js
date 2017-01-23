var mydiv;
var streamIds = [];

function init(callback){
  mydiv = document.createElement('div');
  var bottom = 0;
  $('#pagelet_composer').after(mydiv);

  var streams = [document.getElementById('substream_0')];
  streams.push(streams[0].nextSibling);
  for (var i = 0; i < streams.length; i++){
    observeStream(streams[i], callback);
    streamIds.push(streams[i].id);
  }
  var pagelet = streams[0].nextSibling.nextSibling.children[0];
  observePagelet(pagelet, callback);
}

function processStream(stream){
  sanitize(stream);
  var imgs = [];
  $.merge(imgs, stream.getElementsByClassName('_3chq'));
  $.merge(imgs, stream.getElementsByClassName('_46-i'));
  $.merge(imgs, stream.getElementsByClassName('scaledImageFitWidth'));

  for (var i = 0; i < imgs.length; i++){
    if (imgs[i].width > (stream.offsetWidth - 100)){
      imgs[i].setAttribute('style', 'width:100%; height:auto');
      mydiv.appendChild(imgs[i]);
    }
  }
  stream.remove();
}

function sanitize(stream){
  var elts = [];
  // sponsored
  $.merge(elts, $(stream).find('._3e_2._m8c'));
  // events
  $.merge(elts, $(stream).find('._fw-'));
  for (var i = 0; i < elts.length; i++){
    $(elts).parents("[id*='hyperfeed_story_id_']").remove();
  }
}

function observePagelet(elt, callback){
  var observer = new MutationObserver(function (mutations) {
    var streams = $('._4ikz');
    for (var i = 0; i < streams.length; i++){
      if (streamIds.indexOf(streams[i].id) == -1){
        observeStream(streams[i], callback);
        streamIds.push(streams[i].id);
      }
    }
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

init(processStream);
