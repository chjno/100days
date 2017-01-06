var thumb = chrome.extension.getURL('thumb.png');
var postIndex = 0;

var getLikeElts = function(){
  var children = [];
  var elts = document.getElementsByClassName('_4arz');
  return elts;
};

var getParentElts = function(likeElts){
  var elts = [];
  for (var i = postIndex; i < likeElts.length; i++){
    var parent = likeElts[i].parentElement;
    while (parent.id.indexOf('hyperfeed_story_id_') == -1){
      parent = parent.parentElement;
      if (parent.tagName == 'body'){
        break;
      }
    }
    if (parent.id.indexOf('hyperfeed_story_id_') != -1){
      elts.push(parent);
    }
  }

  return elts;
};

var getLikeStrings = function(likeElts){
  var strings = [];
  for (var i = postIndex; i < likeElts.length; i++){
    var child = likeElts[i].firstChild;
    var text = child.innerText || child.textContent;
    strings.push(text);
  }
  return strings;
};

var parseLikes = function(s){
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
  if (parseInt(s[0], 10)){
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

var getLikes = function(likeStrings){
  var likes = [];
  for (var i = 0; i < likeStrings.length; i++){
    likes.push(parseLikes(likeStrings[i]));
  }
  return likes;
};

var randInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

var breakOut = function(parentElts, likes){
  for (var i = 0; i < parentElts.length; i++){
    var myDiv = parentElts[i];
    myDiv.setAttribute('style', 'position: relative;');

    var height = myDiv.offsetHeight;
    for (var j = 0; j < likes[i]; j++){
      if (j > height * 5){
        // console.log('max: ' + height * 5);
        break;
      }
      var img = document.createElement("img");
      img.setAttribute('src', thumb);
      img.setAttribute('style', "display:block; position: absolute; top:" + randInt(1,96) +
        "%; left:" + randInt(1,96) + "%; z-index:1000;");
      myDiv.appendChild(img);
    }
  }

  postIndex += parentElts.length;
};

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var likeElts = getLikeElts();
      var parentElts = getParentElts(likeElts);
      var likeStrings = getLikeStrings(likeElts);
      var likes = getLikes(likeStrings);

      breakOut(parentElts, likes);
    });
});

var config = {
    attributes: true,
    childList: true,
    characterData: true
};

var likeElts = getLikeElts();
var parentElts = getParentElts(likeElts);
var likeStrings = getLikeStrings(likeElts);
var likes = getLikes(likeStrings);
breakOut(parentElts, likes);

observer.observe(document.body, config);
