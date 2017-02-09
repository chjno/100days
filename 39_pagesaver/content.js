var canvasZ = 0;
function observePage(){
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      $(mutation.addedNodes).each(function (){
        if (this instanceof HTMLElement){
          var index = parseInt($(this).css("zIndex"), 10);
          if (index > canvasZ) {
            canvasZ = index + 1;
            $('#defaultCanvas0').css('z-index', canvasZ);
          }
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

observePage();

$(function (){
});
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  console.log(msg);
  if (msg){
    newGame();
    animate = true;
  } else {
    animate = false;
    $('#defaultCanvas0').remove();
  }
});
