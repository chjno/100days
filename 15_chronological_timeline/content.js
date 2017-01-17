var streamIds = [];
var mainParent;

function init(callback){
  var streams = [document.getElementById('substream_0')];
  mainParent = $(streams[0]).find("[id*='hyperfeed_story_id_']")[0].parentElement;
  streams.push(streams[0].nextSibling);
  for (var i = 0; i < streams.length; i++){
    observeStream(streams[i], callback);
  }

  var pagelet = streams[0].nextSibling.nextSibling.children[0];
  observePagelet(pagelet, callback);
}

function moveAndSort(stream){
  var posts = [];
  $(mainParent.children).each(function (){
    posts.push(this);
  });
  $(stream).find("[id*='hyperfeed_story_id_']").each(function (){
    if ($(this).find('._5ptz.timestamp.livetimestamp').length > 0){
      posts.push(this);
    }
  });

  if (posts.length > 0){
    posts.sort(function (a, b){
      return $(b).find('._5ptz.timestamp.livetimestamp')[0].attributes['data-utime'].value -
             $(a).find('._5ptz.timestamp.livetimestamp')[0].attributes['data-utime'].value;
    });
    mainParent.innerHTML = '';
    for (var j = 0; j < posts.length; j++){
      mainParent.appendChild(posts[j]);
    }
  }
  if (stream.id != 'substream_0'){
    $(stream).remove();
  }
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

init(moveAndSort);
