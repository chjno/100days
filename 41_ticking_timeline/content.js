var then = new Date();
var degs = 0;

function checkTime(){
  var now = new Date();
  var delta = (now - then) / 1000;
  if (delta > 60.0){
    then = now;
    update();
  }
}
setInterval(checkTime, 1000);

function update(){
  degs += 6;

  $('._5pcb').find("[id*='hyperfeed_story_id_']").each(function (){
    this.style = 'transform: rotate(' + degs + 'deg);';
  });

  if (degs >= 360){
    degs = 0;
  }
}

function processStream(stream){
  $(stream).find("[id*='hyperfeed_story_id_']").each(function (){
    this.style = 'transform: rotate(' + degs + 'deg);';
  });
}

var streamIds = [];
function init(callback){
  var streams = [document.getElementById('substream_0')];
  var pagelet = streams[0].nextSibling.nextSibling.children[0];
  streams.push(streams[0].nextSibling);
  for (var i = 0; i < streams.length; i++){
    observeStream(streams[i], callback);
    streamIds.push(streams[i].id);
  }
  observePagelet(pagelet, callback);
}

function observePagelet(elt, callback){
  var observer = new MutationObserver(function (mutations) {
    var streams = $('._4ikz');
    for (var i = 0; i < streams.length; i++){
      if (streamIds.indexOf(streams[i].id) == -1){
        observeStream(streams[i], callback);
        streamIds.push(streams[i].id);
      }
    }
  });

  var config = {
    attributes: true,
    childList: true,
    characterData: true
  };

  observer.observe(elt, config);
}

function observeStream(elt, callback){
  loading = true;

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

init(processStream);
