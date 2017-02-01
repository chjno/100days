var mydiv = document.createElement('div');
$('._qj7yb').prepend(mydiv);
var maindiv = $(mydiv).next()[0];
var straggler;

function header(post){
  return $(post).find('header')[0];
}

function image(post){
  if ($(post).find('._2tomm').length > 0){
    return $('._c8hkj, ._cr348');
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

function comments(post){
  return $(post).find('._mo9iw._pnraw')[0];
}

function process(){

  var posts = $(maindiv).find('article');
  if (posts.length % 2 == 1){
    straggler = posts[posts.length - 1];
  } else {
    straggler = undefined;
  }

  for (var i = 0; i < posts.length; i += 2){
    
    header(posts[i]).after(header(posts[i + 1]));

    var img1 = image(posts[i]);
    var img2 = image(posts[i + 1]);

    $(img1).css('opacity','0.5');
    $(img2).css('opacity','0.5');
    $(img1).after(img2);

    var bottom = $(posts[i]).find('._es1du._rgrbt');

    var likes2 = likes(posts[i + 1]);
    if (likes2){
      bottom.prepend(likes2);
    }

    var comments2 = comments(posts[i + 1]);
    var lastLikeElt = lastLike(posts[i]);

    if (comments2){
      if (lastLikeElt){
        lastLikeElt.after(comments2);
      } else {
        bottom.prepend(comments2);
      }
    }

    mydiv.appendChild(posts[i]);
    $(posts[i + 1]).remove();
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

process();
observeMain(maindiv, process);
