var bodyText = '';
var index = 0;
var title;
var playState = false;

function tabToBody(){
  var h1 = document.createElement('h1');
  h1.innerHTML = title;
  h1.style.textAlign = 'center';
  h1.style.padding = '15px';
  document.body.innerHTML = '';
  document.body.append(h1);

  var url = window.location.hostname;
  var favicon = 'https://www.google.com/s2/favicons?domain=' + url;
  var img = document.createElement('img');
  img.src = favicon;
  $(img).css({
    // 'width': '100%',
    // 'height': '100%',
    'display': 'block',
    'margin': 'auto'
  });

  document.body.append(img);
}

function setFavicon(url){
  var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.rel = 'shortcut icon';
  link.href = url;
  document.getElementsByTagName('head')[0].appendChild(link);
}

function getText(){
  var lines = document.body.innerText.split('\n');
  var textArr = [];
  for (var line of lines){
    if (line !== ''){
      textArr.push(line);
    }
  }

  return textArr.join('  |  ');
}

function scrollText(){
  if (playState){
    var indexEnd = index + 35;
    if (indexEnd > bodyText.length){
      indexEnd = bodyText.length;
    }

    var snippet = bodyText.substring(index, indexEnd);
    document.title = snippet;

    index++;
    if (index == bodyText.length){
      index = 0;
    }

    setTimeout(scrollText, 100);
  }
}

function setPlayState(playing){
  playState = playing;
  scrollText();
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  if (msg.type == 'img'){
    tabToBody();
    $('head :not(title)').remove();
    setFavicon(msg.url);
    observe();
    scrollText();
  } else if (msg.type == 'scroll'){
    window.scrollBy(0, 1);
    window.scrollTo(0, 0);
    chrome.runtime.sendMessage({type: 'screenshot'});
  } else if (msg.type == 'playing'){
    setPlayState(msg.state);
  }
});

$(function (){
  title = document.title;
  window.scrollTo(0, 0);
  bodyText = getText();
  chrome.runtime.sendMessage({type: 'screenshot'});
});


function observe(){
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      $(mutation.addedNodes).each(function (){
        if (this instanceof HTMLElement){
          $(this).remove();
        }
      });
    });
  });

  var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };

  observer.observe(document, config);
}
