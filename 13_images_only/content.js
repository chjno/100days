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

function onlyImages(stream){
  var parent = parentElt(stream);
  var posts = parent.children;

  var imgTags = ['_3chq', 'scaledImageFitWidth img', '_46-i img'];

  // for (var i = 0; i < bodies.length; i++){
  for (var i = 0; i < posts.length; i++){
    var bod = posts[i].getElementsByClassName('userContentWrapper _5pcr')[0];
    if (bod){

      var imgContainer;
      for (var j = 0; j < imgTags.length; j++){
        var imgs = bod.getElementsByClassName(imgTags[j]);

        if (imgs.length > 0){
          imgContainer = imgs[0].parentElement;
          while (imgContainer.className != 'mtm'){
            imgContainer = imgContainer.parentElement;
            // if (imgTags[j] == 'scaledImageFitWidth img'){
              if (imgContainer.className == '_3m6-' && imgContainer.children.length > 1){
                imgContainer.removeChild(imgContainer.children[imgContainer.children.length - 1]);
              }
            // }
          }
          if (imgTags[j] == '_3chq' && imgContainer.children.length > 1){
            imgContainer.removeChild(imgContainer.children[imgContainer.children.length - 1]);
          }

          break;
        }
      }

      var header = bod.getElementsByClassName('_5x46')[0];
      var headerParent = header.parentElement;

      for (var k = 0; k < headerParent.children.length; k++){
        var child = headerParent.children[k];
        if (child.className != '_5x46'){
          headerParent.removeChild(headerParent.children[k]);
        }
      }

      if (imgContainer){
        headerParent.appendChild(imgContainer);
      } else {
        parent.removeChild(posts[i]);
      }
      bod.removeChild(bod.children[bod.children.length - 1]);
      // console.log(bod.children[bod.children.length - 1]);
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

init(onlyImages);
