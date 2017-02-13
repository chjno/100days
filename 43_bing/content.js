// console.log('content.js version: 3');

chrome.runtime.sendMessage('load');

$(document).keydown(function(e) {
  switch (e.keyCode) {
    case 8:
      chrome.runtime.sendMessage('delete');
      break;
    case 13:
      chrome.runtime.sendMessage('enter');
      break;
    case 32:
      chrome.runtime.sendMessage('space');
      break;
    default:
      chrome.runtime.sendMessage('key');
  }
});

var scrolling = false;
var scrollTimeout;
$(function() {
  $(window).scroll(function() {
    if (!scrolling) {
      scrolling = true;
      chrome.runtime.sendMessage('scroll');
    }
  });
});

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  // console.log(req);
  if (req == 'scroll') {
    scrolling = false;
  }
});

$(window).click(function(e) {
  if (e.target.tagName == 'A') {
    chrome.runtime.sendMessage('link');
  } else {
    chrome.runtime.sendMessage('click');
  }
});
