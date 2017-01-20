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

var streamIds = [];
var mainParent;
function init(callback){
  var streams = [document.getElementById('substream_0')];
  var posts = $(streams[0]).find("[id*='hyperfeed_story_id_']");
  mainParent = posts[0].parentElement;
  for (var i = 0; i < posts.length; i++){
    var list = posts[i].getElementsByClassName('uiList uiCollapsedList uiCollapsedListHidden _5pbz _5va0 _4kg');
    if (list.length === 0){
      $(posts[i]).remove();
    }
  }

  streams.push(streams[0].nextSibling);
  for (var j = 0; j < streams.length; j++){
    observeStream(streams[j], callback);
    streamIds.push(streams[j].id);
  }

  var pagelet = streams[0].nextSibling.nextSibling.children[0];
  observePagelet(pagelet, callback);
}

function prune(stream){
  var posts = $(stream).find("[id*='hyperfeed_story_id_']");
  for (var i = 0; i < posts.length; i++){
    var list = posts[i].getElementsByClassName('uiList uiCollapsedList uiCollapsedListHidden _5pbz _5va0 _4kg');
    if (list.length > 0){
      mainParent.appendChild(posts[i]);
    }
  }
  if (stream.id != 'substream_0'){
    $(stream).remove();
  }
}

init(prune);
