function likeAll(stream){
  var likeElts = stream.getElementsByClassName('UFILikeLink');
  for (var i = 0; i < likeElts.length; i++){
    if (likeElts[i].hasAttribute('aria-pressed')){
      if (likeElts[i].getAttribute('aria-pressed') == 'false'){
        likeElts[i].click();
      }
    } else if (likeElts[i].hasAttribute('data-ft')){
      if (JSON.parse(likeElts[i].getAttribute('data-ft')).tn == '>'){
        likeElts[i].click();
      }
    }
  }
}

function init(){
  var streams = [document.getElementById('substream_0')];
  streams.push(streams[0].nextSibling);
  for (var i = 0; i < streams.length; i++){
    observeStream(streams[i]);
    streamIds.push(streams[i].id);
  }
  
  var stream3 = streams[0].nextSibling.nextSibling.children[0];
  onMorePosts(stream3);
}

function onMorePosts(pagelet){
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      update(pagelet);
    });
  });

  var config = {
    attributes: true,
    childList: true,
    characterData: true
  };

  observer.observe(pagelet, config);
}

var streamIds = [];
function update(stream){
  var streams = stream.getElementsByClassName('_4ikz');
  for (var i = 0; i < streams.length; i++){
    if (streamIds.indexOf(streams[i].id) == -1){
      observeStream(streams[i]);
      streamIds.push(streams[i].id);
    }
  }
}

function observeStream(stream){

  function stopObserving(){
    observer.disconnect();
  }

  var timeout;
  function setDelay(){
    clearTimeout(timeout);
    timeout = setTimeout(stopObserving, 500);
  }

  var observer = new MutationObserver(function (mutations) {
    likeAll(stream);
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

init();
