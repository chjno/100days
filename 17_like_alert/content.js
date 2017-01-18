var streamIds = [];
var posts = [];
var index = 0;
var ig1 = chrome.extension.getURL('ig1.png');
var ig2 = chrome.extension.getURL('ig2.png');
var ig3 = chrome.extension.getURL('ig3.png');

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

function gatherPosts(stream){
  posts = $.merge(posts, $(stream).find("[id*='hyperfeed_story_id_']"));
  for (var i = 0; i < posts.length; i++){
    prepPopup(posts[i]);
  }
  visiblePosts();
}

$(window).scroll(function (){
  visiblePosts();
});

function visiblePosts(){
  for (var i = 0; i < posts.length; i++){
    var post = posts[i];
    // if ($(post).visible(true)){
    if (isVisible(post)){
      posts.splice(posts.indexOf(post), 1);
      showPopup(post);
    }
  }
}

function isVisible(post){
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(post).offset().top;
    // var elemBottom = elemTop + $(post).height();

    return ((elemTop <= docViewBottom) && (elemTop >= docViewTop));
    // return (elemTop >= docViewTop);
}

function showPopup(post){
  var poopup = $(post).find('.poopup');
  setTimeout(function (){
    $(poopup[0]).fadeIn(1000, function (){
      setTimeout(function (){
        $(poopup[0]).fadeOut(1000);
      }, 3000);
    });
  }, 500);

}

function prepPopup(post){
  var likes = getLikes(post).toString();
  if (likes.length == 4){
    likes = [likes.slice(0, 1), '.', likes.slice(1,2), 'K'].join('');
  } else if (likes.length > 4 && likes.length < 7){
    likes = [likes.slice(0, likes.length - 3), 'K'].join('');
  } else if (likes.length == 7){
    likes = [likes.slice(0, 1), '.', likes.slice(1,2), 'M'].join('');
  } else if (likes.length > 7 && likes.length < 10){
    likes = [likes.slice(0, likes.length - 6), 'M'].join('');
  } else if (likes.length == 10){
    likes = [likes.slice(0, 1), '.', likes.slice(1,2), 'B'].join('');
  } else if (likes.length > 10 && likes.length < 13){
    likes = [likes.slice(0, likes.length - 9), 'B'].join('');
  }

  var imgSrc = ig1;
  if (likes.length == 2){
    imgSrc = ig2;
  } else if (likes.length == 3){
    imgSrc = ig3;
  } else if (likes.length > 3) {
    imgSrc = ig4;
  }

  var div = document.createElement('div');
  div.setAttribute('style', "display:block; position: absolute; top:-30px;left:92%; z-index:1000; display:none;");
  div.className = 'poopup';
  // div.innerHTML = likes;
  var div2 = document.createElement('div');
  div2.setAttribute('style', "position: relative;");
  // div2.innerHTML = likes;
  var span = document.createElement('span');
  span.setAttribute('style', "position: absolute; top:10px; left:30px; z-index:1001; color:white;");
  span.innerHTML = likes;

  post.setAttribute('style', 'position: relative;');
  var img = document.createElement("img");
  img.setAttribute('src', imgSrc);
  img.setAttribute('style', "display:block; position: absolute; z-index:1000;");
  div2.appendChild(img);
  div2.appendChild(span);
  div.appendChild(div2);
  post.appendChild(div);


  // ._4qba comments/shares

  // data-intl-translation="{count} Comments"
  // data-intl-translation="View {count} more comments"
  // data-intl-translation="1 Reply"

  // data-intl-translation="{count} Shares"

  // aria-label="Comment"
}

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

  var likeString = '';
  if (likeElt){
    likeString = likeElt.innerText || likeElt.textContent;
  } else {
    likeString = '0';
  }

  var likes = 0;
  if (likeString != '0'){
    likes = parseLikeString(likeString);
  }
  return likes;
}

init(gatherPosts);
