var getTextNodes = function(el) {
  return $(el).find(":not(iframe)").addBack().contents().filter(function() {
    return this.nodeType == 3;
  });
};

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){

  var visibleElts = $('body :visible');
  var onScreenElts = [];
  $(visibleElts).each(function (){
    if ($(this).offset().top > $(window).scrollTop() && $(this).offset().top + $(this).height() < $(window).scrollTop() + $(window).height()){
      onScreenElts.push(this);
    }
  });

  var textNodes = getTextNodes(onScreenElts);
  var index = randInt(0, textNodes.length);
  while (!(/\S/.test($(textNodes[index]).text().replace(/\r?\n|\r/g, '')) && $(textNodes[index]).text().indexOf('{') == -1 && $(textNodes[index]).text().indexOf(';') == -1)){
    textNodes.splice(index, 1);
    if (textNodes.length === 0){
      break;
    }
    index = randInt(0, textNodes.length);
  }

  textNodes[index].nodeValue = msg;
});