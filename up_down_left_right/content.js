window.onload = function(){
  
  var winHeight = $(window).height();
  var winWidth = $(window).width();

  var down = document.createElement('img');
  down.src = chrome.extension.getURL('down.png');

  $(down).css({
    'position': 'fixed',
    'top': winHeight - 144,
    'left': winWidth - 152,
    'width': 304,
    'height': 144
  });

  $('body').append(down);

};
