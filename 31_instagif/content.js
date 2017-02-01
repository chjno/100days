function header(post){
  return $(post).find('header')[0];
}

function image(post){
  if ($(post).find('._2tomm').length > 0){
    // return $('._c8hkj, ._cr348');
    $(post).remove();
  } else {
    return $(post).find("[id*='pImage_']")[0];
  }
}

function likes(post){
  return $(post).find('._tfkbw._hpiil')[0];
}

function lastLike(post){
  return $(post).find('._tfkbw._hpiil').last();
}

function lastComment(post){
  return $(post).find('._mo9iw._pnraw').last();
}

function comments(post){
  return $(post).find('._mo9iw._pnraw')[0];
}

function process(){

  var posts = $('article:not(.first)');

  for (var i = 0; i < posts.length; i++){
    
    mainHeader.after(header(posts[i]));


    var img = image(posts[i]);

    $(img).css('opacity','0.5');
    $(mainImg).after(img);

    var likeElt = likes(posts[i]);
    var lastLikeElt = lastLike(mainArticle);

    if (likeElt){
      if (lastLikeElt){
        lastLikeElt.after(likeElt);
      } else {
        bottom.prepend(likeElt);
      }
    }

    var commentElt = comments(posts[i]);
    var lastCommentElt = lastComment(mainArticle);

    if (commentElt){
      if (lastCommentElt){
        lastCommentElt.after(commentElt);
      } else if (lastLikeElt){
        lastLikeElt.after(commentElt);
      } else {
        bottom.prepend(commentElt);
      }
    }

    $(posts[i]).remove();
  }
}

function observeMain(elt, callback){
  var observer = new MutationObserver(function (mutations) {
    callback();
  });

  var config = {
    attributes: true,
    childList: true,
    characterData: true
  };

  observer.observe(elt, config);
}

var maindiv = $('._qj7yb').children(':first-child')[0];

var mainArticle = $('article')[0];
$(mainArticle).addClass('first');
var mainHeader = header(mainArticle);
var mainImg = image(mainArticle);
$(mainImg).css('opacity','0.5');
// $(mainImg).parent().height(600);
// $(mainImg).parent().width(600);

$(mainImg).parent().css({
  width: 600,
  height: 600
});
var bottom = $(mainArticle).find('._es1du._rgrbt');


process();
observeMain(maindiv, process);


(function($) {

$.fn.randomize = function(childElem) {
  return this.each(function() {
      var $this = $(this);
      var elems = $this.children(childElem);

      elems.sort(function() { return (Math.round(Math.random())-0.5); });  

      $this.detach(childElem);  

      for(var i=0; i < elems.length; i++)
        $this.append(elems[i]);      

  });    
}
})(jQuery);

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function cycle(){
  $(mainArticle).randomize('._jjzlb', 'img');

  // var images = $(mainArticle).find("[id*='pImage_']");
  // for (var i = 0; i < images.length; i++){
  //   var opacity = randInt(0, 75) / 100.0;
  //   $(images[i]).css('opacity', opacity.toString());
  // }
  
}

function shuffle(){
  var parent = $('._jjzlb');
  var divs = parent.children();
  while (divs.length) {
      parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
  }
}

setInterval(shuffle, 100);
