var streamIds = [];
function init(callback){
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
  var posts = postsFromStream(stream);
  for (var i = 0; i < posts.length; i++){
    var header = $(posts[i]).find('._5x46')[0];
    var parent = header.parentElement;
    var commentable = $(posts[i]).find('.commentable_item')[0];
    parent.appendChild(commentable);
    // var divs = parent.children;

    for (var j = parent.children.length; j >= 0; j--) {
      parent.appendChild(parent.children[Math.random() * j | 0]);
    }
  }
}

function postsFromStream(stream){
  return $(stream).find("[id*='hyperfeed_story_id_']");
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
