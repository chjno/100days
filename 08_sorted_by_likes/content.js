var main;
var pagelet;
var streamIds = [];

function sortPosts(){
  var posts = [];
  for (var i = 0; i < main.children.length; i++){
    posts.push(main.children[i]);
  }
  if (posts.length > 0){
    posts.sort(function (a, b){
      return b.attributes.likez.value - a.attributes.likez.value;
    });
    main.innerHTML = '';
    for (var j = 0; j < posts.length; j++){
      main.appendChild(posts[j]);
    }
  }
}

function processPosts(container){
  for (var i = 0; i < container.children.length; i++){
    var post = container.children[i];
    var likes = getLikes(post);
    post.setAttribute('likez', likes);
    main.appendChild(post);
    sortPosts();
  }
}

function init(){

  var stream = document.getElementById('substream_0');
  main = streamParent(stream);
  processPosts(main);

  var second = stream.nextSibling;
  var container = streamParent(second);
  if (container){
    processPosts(container);
  }

  pagelet = stream.nextSibling.nextSibling.children[0];
  detectChanges();
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

function detectChanges(){
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

init();
