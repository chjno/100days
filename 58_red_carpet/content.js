var popup = chrome.extension.getURL('red.html');

$(window).mousemove(function (e){
  window.open(popup, '', 'width=100, height=100, top=' + e.clientY + ', left=' + (e.clientX - 50));
});