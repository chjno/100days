var scrollDown = function(){
  window.scrollBy(0, window.innerHeight);
  var button = document.getElementsByClassName('_5usd');
  button[0].click();
  window.scrollBy(0, window.innerHeight);

  stripAds();
};

var stripAds = function(){
  var adTags = ['_m8d', '_3e_2 _m8c'];

  for (var j = 0; j < adTags.length; j++){
    var ads = document.getElementsByClassName(adTags[j]);
    for (var i = 0; i < ads.length; i++){
      var parent = ads[i].parentElement;
      while (parent.id.indexOf('hyperfeed_story_id_') == -1){
        parent = parent.parentElement;
        if (parent.tagName == 'body'){
          break;
        }
      }
      if (parent.id.indexOf('hyperfeed_story_id_') != -1){
        parent.parentElement.removeChild(parent);
      }
    }
  }

  getPosts();
};

var getPosts = function(){
  var posts = [];
  var divs = document.getElementsByTagName('div');
  for (var i = 0; i < divs.length; i++){
    if (divs[i].id.indexOf('hyperfeed_story_id_') != -1){
      posts.push(divs[i]);
    }
  }
  
  getLinks(posts);
};

var getLinks = function(arr){
  var links = [];
  for (var i = 0; i < arr.length; i++){
    var as = arr[i].getElementsByTagName('a');
    for (var j = 0; j < as.length; j++){
      if (as[j].href.indexOf('www.facebook.com') == -1 && links.indexOf(as[j].href) == -1){
        links.push(as[j].href);
      }
    }
  }
  chrome.runtime.sendMessage(links);
};

scrollDown();
