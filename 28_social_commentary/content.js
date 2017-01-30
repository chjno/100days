var streamIds = [];
var mydiv;
function init(callback){
  mydiv = document.createElement('div');
  $('#pagelet_composer').after(mydiv);
  var streams = [document.getElementById('substream_0')];
  streams.push(streams[0].nextSibling);
  for (var i = 0; i < streams.length; i++){
    observeStream(streams[i], callback);
    streamIds.push(streams[i].id);
  }
  var pagelet = streams[0].nextSibling.nextSibling.children[0];
  observePagelet(pagelet, callback);
}

function processStream(stream){
  $(stream).find('.UFICommentLink, .UFIPagerLink').each(function (){
      this.click();
  });
  var arr = $(stream).find('.UFIRow.UFIComment._4oep');
  arr = shuffle(arr);
  $(arr).appendTo(mydiv);
  stream.remove();
  var button = document.getElementsByClassName('_5usd');
  if (button.length > 0){
    if (isScrolledIntoView(button[0])){
      button[0].click();
    }
  }
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

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function isScrolledIntoView(elem){
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();

  var elemTop = $(elem).offset().top;
  var elemBottom = elemTop + $(elem).height();

  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

init(processStream);
