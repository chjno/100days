var mainParent;
var streamIds = [];
function init(callback){
  var streams = [document.getElementById('substream_0')];
  mainParent = $(streams[0]).find("[id*='hyperfeed_story_id_']")[0].parentElement;
  streams.push(streams[0].nextSibling);
  for (var i = 0; i < streams.length; i++){
    observeStream(streams[i], callback);
    streamIds.push(streams[i].id);
  }
  var pagelet = streams[0].nextSibling.nextSibling.children[0];
  observePagelet(pagelet, callback);
}

var innerPost;
var timeout;
var processing = false;
function processStream(stream){

  if (processing){
    timeout = setTimeout(function (){
      processStream(stream);
    }, 100);
  } else {
    processing = true;
    clearTimeout(timeout);

    // shared/liked, suggested/commented, birthdays, special facebook posts (MLK)
    $(stream).find('._1qbu._5pbw._5vra, ._5g-l, .mbs._4bxd._5pbw._5vra, ._3j6k._5pcr')
           .parents("[id*='hyperfeed_story_id_']").remove();

    var posts = postsFromStream(stream);
    $(mainParent).append(posts);

    if (stream.id != 'substream_0'){
      $(stream).remove();
    }

    if (posts.length > 0){
      for (var i = 0; i < posts.length; i++){

        if (i == 0 && stream.id == 'substream_0'){
          innerPost = posts[0];
          continue;
        }

        var outerPost = posts[i];
        if (outerPost.getElementsByClassName('_5x46').length > 0){
          $(outerPost).find('._5pbx.userContent').remove();
          $(outerPost).find('._3x-2').remove();
          $(outerPost.getElementsByClassName('_5x46')[0]).after(innerPost);

          innerPost = outerPost;
        } else {
          $(posts[i]).remove();
        }
      }
    }

    processing = false;
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
