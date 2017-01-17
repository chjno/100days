var streamIds = [];
var streamPosts = {};

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

function requestArticles(stream){
  streamPosts[stream.id] = $(stream).find("[id*='hyperfeed_story_id_']");
  chrome.runtime.sendMessage({streamId: stream.id, num: streamPosts[stream.id].length});
}

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse){
  insertArticles(req.streamId, req.articles);
});

function insertArticles(streamId, articles){
  var posts = streamPosts[streamId];
  for (var i = 0; i < posts.length; i++){
    var article = articles[i];
    var url = article.web_url;
    var snippet = article.snippet;
    var byline = article.byline.original;
    var headline = article.headline.main;
    var img = '';
    for (var j = 0; j < article.multimedia.length; j++){
      if (article.multimedia[j].type == 'image' && article.multimedia[j].subtype == 'xlarge'){
        img = 'https://www.nytimes.com/' + article.multimedia[j].url;
        break;
      }
    }
    if (img === ''){
      $(posts[i]).remove();
      continue;
    }

    var articleElt = '<div data-ft="{&quot;tn&quot;:&quot;H&quot;}"><div class="mtm"><div id="u_jsonp_2_16" class="_6m2 _1zpr clearfix _dcs _4_w4 _59ap" data-ft="{&quot;tn&quot;:&quot;H&quot;}"><div class="clearfix _2r3x"><div class="lfloat _ohe"><span class="_3m6-"><div class="_6ks"><a href=' + url + ' tabindex="-1" target="_blank"><div class="_6l- __c_"><div class="uiScaledImageContainer _6m5 fbStoryAttachmentImage" style="width:476px;height:249px;"><img class="scaledImageFitWidth img" src=' + img + ' alt="" width="476" height="249"></div></div></a></div><div class="_3ekx _29_4"><div class="_6m3 _--6"><div class="mbs _6m6 _2cnj _5s6c"><a href=' + url + ' target="_blank" data-lynx-async-dest=' + url + '>' + headline + '</a></div><div class="_6m7 _3bt9">' + snippet +'</div><div class="_59tj _2iau"><div><div class="_6lz _6mb ellipsis">nytimes.com<span class="phs">|</span>' + byline + '</div><div class="_5tc6"></div></div></div></div><a class="_52c6" href=' + url + ' tabindex="-1" target="_blank"></a></div></span></div><div class="_42ef"><span class="_3c21"></span></div> </div></div></div></div>';
    $(posts[i]).find('._3x-2').html(articleElt);
  }

  // delete streamId from streamPosts
  delete streamPosts[streamId];
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

  var observer = new MutationObserver(function (mutations) {
    setDelay();
  });

  var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };

  observer.observe(elt, config);
}

init(requestArticles);
