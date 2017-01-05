var thumb = chrome.extension.getURL('thumb.png');

var getLikeElts = function(){
  var children = [];
  var elts = document.getElementsByClassName('_4arz');
  return elts;
};

var getParentElts = function(likeElts){
  var elts = [];
  for (var i = 0; i < likeElts.length; i++){
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

var getLikeStrings = function(posts){
  var strings = [];
  for (var i = 0; i < posts.length; i++){
    var child = posts[i].firstChild;
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

      // if last element is a number
      if (parseInt(lastItem[0], 10)){
        hasK(lastItem[0].split(' ')[0]);

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

// var observer = new MutationObserver(function(mutations) {
//     mutations.forEach(function(mutation) {
//       getPosts();
//     });
// });

// var config = {
//     attributes: true,
//     childList: true,
//     characterData: true
// };

// getPosts();
// observer.observe(document.body, config);

var likeElts = getLikeElts();
var parentElts = getParentElts(likeElts);
var likeStrings = getLikeStrings(likeElts);
var likes = getLikes(likeStrings);

console.log(likeElts.length);
console.log(parentElts.length);
console.log(likeStrings.length);
console.log(likes.length);



var myDiv = parentElts[0];
var width = myDiv.offsetWidth;
var height = myDiv.offsetHeight;

console.log(width);
console.log(height);

var img = document.createElement("img");
img.setAttribute('src', thumb);
img.setAttribute('style', 'margin-top:-' + height/2 + 'px;margin-left:' + width/2 + 'px;');

myDiv.insertBefore(img, myDiv.firstChild);


console.log(myDiv);





