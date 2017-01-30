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
  $(posts).each(function (){
    var post = this;
    $(post).find("img[alt*='Image may contain']").each(function (){
      var myP = document.createElement('p');
      myP.innerHTML = this.alt;
      myP.setAttribute('style', 'color:red;');
      $(post).find('._3x-2').last().append(myP);
    });
  });
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
