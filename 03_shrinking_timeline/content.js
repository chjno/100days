var posts = [];
var postIndex = 0;

var getPosts = function(){
  posts = [];
  var divs = document.getElementsByTagName('div');
  for (var i = 0; i < divs.length; i++){
    if (divs[i].id && divs[i].id.indexOf('hyperfeed_story_id_') != -1){
      posts.push(divs[i]);
    }
  }
  shrinkPosts();
};

var shrinkPosts = function(){
  for (var i = postIndex; i < posts.length; i++){
    if (postIndex > 0){
      posts[i].setAttribute('style','transform:scale(' + (1 - Math.tanh(.1 * postIndex)) + ');');
    }    
    postIndex++;
  }
};

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      getPosts();
    });
});

var config = {
    attributes: true,
    childList: true,
    characterData: true
};

getPosts();
observer.observe(document.body, config);
