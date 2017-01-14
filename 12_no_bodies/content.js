var streamIds = [];

function init(callback){
  var streams = [document.getElementById('substream_0')];
  streams.push(streams[0].nextSibling);
  for (var i = 0; i < streams.length; i++){
    observeStream(streams[i], callback);
  }
  var pagelet = streams[0].nextSibling.nextSibling.children[0];
  pageletObserver(pagelet, callback);
}

function noBodies(stream){
  var postContent = stream.getElementsByClassName('userContentWrapper _5pcr');
  for (var i = 0; i < postContent.length; i++){
    var header = postContent[i].getElementsByClassName('_5x46')[0];
    while (header.nextSibling){
      header.parentElement.removeChild(header.nextSibling);
    }
  }
}

function parentElt(streamElt){
  var parent;
  if (streamElt.children[0]){
    parent = streamElt.children[0];
    if (parent.children[0]){
      while (parent.children[0].id.indexOf('hyperfeed_story_id_') == -1){
        parent = parent.children[0];
        if (!parent.children[0]){
          return null;
        }
      }
    }
  } else {
    return null;
  }
  return parent;
}

function pageletObserver(pagelet, callback){
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var streams = pagelet.getElementsByClassName('_4ikz');
      for (var i = 0; i < streams.length; i++){
        if (streamIds.indexOf(streams[i].id) == -1){
          observeStream(streams[i], callback);
        }
      }
    });
  });

  var config = {
    attributes: true,
    childList: true,
    characterData: true
  };

  observer.observe(pagelet, config);
}

function observeStream(stream, callback){
  streamObserver(stream, callback);
  streamIds.push(stream.id);
}

function streamObserver(stream, callback){

  function stopObserving(){
    observer.disconnect();
    callback(stream);
  }

  var timeout;
  function setDelay(){
    clearTimeout(timeout);
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

  observer.observe(stream, config);
}

init(noBodies);
