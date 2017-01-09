function streamParent(streamElt){
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

var getLikeString = function(likeElt){
  if (likeElt){
    var text = likeElt.innerText || likeElt.textContent;
    return text;
  } else {
    return '0';
  }
};

var parseLikeString = function(s){
  var likes = 0;

  var hasK = function(s2){
    try {
      if (s2.indexOf('K') == -1){
        likes += parseFloat(s2);
      } else {
        likes += parseFloat(s2.split('K')[0]) * 1000;
      }
    } catch (e) {
      console.log(e);
    }
  };

  // if like string starts with a number
  if (parseInt(s[0], 10) >= 0){
    hasK(s);

  // if like string starts with a name
  } else {

    // if like string contains the word 'and'
    if (s.indexOf(' and ') != -1){
      var a = s.split(' and ');

      var names = a[0];
      var lastItem = a[1];

      likes += names.split(',').length;

      // if last element starts with a number
      if (parseInt(lastItem[0], 10)){
        hasK(lastItem.split(' ')[0]);

      // if last element is a name
      } else {
        likes += 1;
      }

    // if like string is just one name
    } else {
      likes = 1;
    }
  }
  return likes;
};

function getLikes(post){
  var likeElt = post.getElementsByClassName('_4arz')[0];
  var likeString = getLikeString(likeElt);
  var likes = 0;
  if (likeString != '0'){
    likes = parseLikeString(likeString);
  }
  return likes;
}

function observe(stream){
  // console.log('observing ' + stream.id);

  function processStream(){
    // console.log('processing ' + stream.id);
    observer.disconnect();
    var container = streamParent(stream);
    if (container){
      processPosts(container);
      stream.parentElement.removeChild(stream);
    }
  }

  var timeout;
  function setDelay(){
    clearTimeout(timeout);
    timeout = setTimeout(processStream, 500);
  }

  var observer = new MutationObserver(function (mutations) {
    // console.log('mutating');
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
