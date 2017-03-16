var scrollY;
var winHeight;
function sendHeight(){
  winHeight = $(window).height();
  var docHeight = $(document).height();
  var tabs = Math.floor(docHeight / winHeight);
  if (docHeight == winHeight) {
    tabs--;
  }
  // console.log(winHeight, docHeight, tabs);

  chrome.runtime.sendMessage({ type: 'loaded', add: tabs });
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.type == 'scroll') {
    scrollY = winHeight * msg.index;
    window.scrollTo(0, scrollY);
    rescroll();
  }
});

function rescroll(){
  console.log('rescroll');
  if ($(window).scrollTop() === 0){
    window.scrollTo(0, scrollY);
    setTimeout(rescroll, 500);
  }
}

sendHeight();