var getPosts = function(){
  var posts = [];
  var divs = document.getElementsByTagName('div');
  for (var i = 0; i < divs.length; i++){
    if (divs[i].id.indexOf('hyperfeed_story_id_') != -1){
      posts.push(divs[i]);
    }
  }
  
  return posts;
};

posts[0].setAttribute('style','transform:scale(.5);');
