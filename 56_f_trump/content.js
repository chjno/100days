var finger = chrome.extension.getURL('finger_small.png');
var style = $('<style>.f-trump { cursor: url(' + finger + '), auto; }</style>');
$('head').append(style);

$.expr[":"].Contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

function tagTrump(){
  $('body :not(script):Contains(trump)').each(function (){
    if ($(this.children).find(':Contains(trump)').length === 0){
      $(this).addClass('f-trump');
    }
  });
  console.log($('.f-trump'));
}

function observe(){
  var observer = new MutationObserver(function (mutations) {
    tagTrump();
  });

  var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };

  observer.observe(document, config);
}

tagTrump();
$(function (){
  observe();
});