var streamIds = [];

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

function getPH(children){
  var headers = [];
  for (var i = 0; i < children.length; i++){
    var post = children[i];
    var headerElts = post.getElementsByClassName('_5x46');
    for (var j = 0; j < headerElts.length; j++){
      var aTags = headerElts[j].getElementsByTagName('a');
      if (aTags.length < 2){
        return null;
      } else {
        try{
          headers.push([[aTags[0].parentElement, aTags[1].parentElement], [aTags[0], aTags[1]]]);
        } catch (e){
          console.log(aTags);
        }
      }
    }
  }
  return headers;
}

function swapHeaders(ph){
  for (var i = 0; i < ph.length; i++){
    var nextHeader;
    if (i < ph.length - 1){
      nextHeader = ph[i + 1];
    } else {
      nextHeader = ph[0];
    }

    var header = ph[i];
    var parents = header[0];
    var elts = header[1];
    var nextElts = nextHeader[1];
    for (var j = 0; j < elts.length; j++){
      parents[j].insertBefore(nextElts[j], parents[j].children[0]);
      if (elts[j].parentElement == parents[j]){
        parents[j].removeChild(elts[j]);
      }
    }
  }
}

function processStream(){
    observer.disconnect();
    var parent = parentElt(stream);
    if (parent){
      var children = parent.children;
      var ph = getPH(children);
      if (ph){
        swapHeaders(ph);
      }
    }
  }

function init(){
  var stream1 = document.getElementById('substream_0');
  var parent1 = parentElt(stream1);
  var children = [];
  children.push(parent1.children);
  var stream2 = stream1.nextSibling;
  var parent2 = parentElt(stream2);
  if (parent2){
    children.push(parent2.children);
  }

  var ph = [];
  for (var i = 0; i < children.length; i++){
    ph.push(getPH(children[i]));
  }
  ph = ph[0].concat(ph[1]);
  console.log(ph);
  swapHeaders(ph);

  pagelet = stream1.nextSibling.nextSibling.children[0];
  onMorePosts();
}

function update(){
  var streams = pagelet.getElementsByClassName('_4ikz');
  for (var i = 0; i < streams.length; i++){
    if (streamIds.indexOf(streams[i].id) == -1){
      observe(streams[i]);
      streamIds.push(streams[i].id);
    }
  }
}

function onMorePosts(){
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      update();
    });
  });

  var config = {
    attributes: true,
    childList: true,
    characterData: true
  };

  observer.observe(pagelet, config);
}

function observe(stream){

  function processStream(){
    observer.disconnect();
    var parent = parentElt(stream);
    if (parent){
      var children = parent.children;
      var ph = getPH(children);
      if (ph){
        swapHeaders(ph);
      }
    }
  }

  var timeout;
  function setDelay(){
    clearTimeout(timeout);
    timeout = setTimeout(processStream, 500);
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

init();
