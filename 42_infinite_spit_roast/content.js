var mydiv;
var streamIds = [];
var posts = [];
var index = 0;
var angle = 0;
var prevSt = 0;
var loading = true;

window.addEventListener('scroll', function (e) {
    scrolling = true;
    if (posts.length > 0){
      var st = $(window).scrollTop();
      if (st > prevSt){
        roast('down');
        var sb = st + $(window).height();
        var divb = $(mydiv).offset().top + $(mydiv).height();
        if (sb > divb){
          var mydivOffset = divb - $(window).height();
          if (mydivOffset < 1){
            scrollTo(0, 1);
            // prevSt = 1;
          } else {
            scrollTo(0, mydivOffset);
            // prevSt = mydivOffset;
          }
        }
      } else if (st < prevSt) {
        roast('up');
        if (st === 0){
          scrollTo(0, 1);
          // prevSt = 1;
        }
      }
      prevSt = $(window).scrollTop();

      if (posts.length - index < 5){
        loadMore();
      }
    }
});

function init(callback){
  mydiv = document.createElement('div');
  $('#pagelet_composer').after(mydiv);
  buffer = document.createElement('div');
  buffer.style.visibility = 'hidden';
  $(mydiv).after(buffer);

  var streams = [document.getElementById('substream_0')];
  var pagelet = streams[0].nextSibling.nextSibling.children[0];
  streams.push(streams[0].nextSibling);
  for (var i = 0; i < streams.length; i++){
    observeStream(streams[i], callback);
    streamIds.push(streams[i].id);
  }
  observePagelet(pagelet, callback);
}

function processStream(stream){
  var newPosts = $(stream).find("[id*='hyperfeed_story_id_']");
  $.merge(posts, newPosts);
  loading = false;
  for (var i = 0; i < posts.length; i++){
    if (i == index){
      $(mydiv).append(posts[i]);
    } else {
      $(buffer).append(posts[i]);
    }
  }
  $(stream).remove();
  var sid = streamIds.indexOf(stream.id);
  streamIds.splice(sid, 1);
  if (streamIds.length === 0){
    loading = false;
  }
}

function loadMore(){
  if (!loading){
    var button = document.getElementsByClassName('_5usd');
    button[0].click();
    loading = true;
  }
}

function roast(dir){
  var post = posts[index];

  if (dir == 'down'){
    angle++;
    if (angle > 90){
      $(buffer).append(post);
      $(post).removeAttr('style');
      index++;
      post = posts[index];
      $(mydiv).append(post);
      angle = -90;
    }
  } else {
    angle--;
    if (angle < -90){
      if (index === 0){
        angle = -90;
      } else {
        $(buffer).append(post);
        $(post).removeAttr('style');
        index--;
        post = posts[index];
        $(mydiv).append(post);
        angle = 90;
      }
    }
  }

  post.style = 'transform: rotateX(' + angle + 'deg);';
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
  loading = true;

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
