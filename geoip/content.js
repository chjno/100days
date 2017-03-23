$(function (){
  sendUrls();

});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  console.log(msg);

});

function sendUrls(){
  $('a').each(function (){
    if (!$(this).hasClass('81-click-distance')){
      $(this).addClass('81-click-distance');
      chrome.runtime.sendMessage({type: 'url', url: this.href});
    }
  });
}


// observer