var popup = chrome.extension.getURL('red.html');

$(window).mousemove(function (e){
  var x = e.clientX - 50;
  var y = e.clientY;
  window.open(popup, '', 'width=100, height=100, top=' + y + ', left=' + x);
});
