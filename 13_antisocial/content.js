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

function deleteCommentables(stream){
  var commentables = document.body.getElementsByClassName('commentable_item');
  for (var i = 0; i < commentables.length; i++){
    try{
      commentables[i].parentElement.removeChild(commentables[i]);
      commentables[i].parentElement.innerHTML = '';
    } catch(e){}
  }
  // _sa_ _5vsi _ca7 _192z
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

init(deleteCommentables);
