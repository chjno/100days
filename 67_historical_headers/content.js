/*
  headers = {
    urls: [url1, url2],
    imgs: [image1, image2]
  }
*/
function addHeaders(headers){
  console.log('add headers');
  var urls = headers.urls;
  var imgs = headers.imgs;

  for (var i = 0; i < urls.length; i++){
    createHeader(urls[i], imgs[i]);
  }
}

function createHeader(url, imgSrc){
  console.log(url);
  var div = document.createElement('div');
  $(div).css({
    'height': '100px',
    'width': '100%',
    'top': 0,
    'left': 0,
    'overflow': 'hidden'
  });

  var a = document.createElement('a');
  a.href = url;
  div.append(a);

  var img = document.createElement('img');
  img.src = imgSrc;
  a.append(img);

  document.body.prepend(div);
  console.log(div);
}

// $(function (){

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
    console.log(msg);
    if (msg.type == 'headers'){
      console.log('type headers');
      addHeaders(msg.headers);
    } else if (msg.type == 'scroll'){
      window.scrollBy(0,1);
    }
  });

  // chrome.runtime.sendMessage({type: 'load', url: window.location.href});

  var scrollTimeout;
  $(window).scroll(function (e){
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function (){
      console.log('done scrolling');
      chrome.runtime.sendMessage({type: 'update', url: window.location.href});
    }, 100);
  });
// });