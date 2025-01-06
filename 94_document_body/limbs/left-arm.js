chrome.runtime.sendMessage('leftArm');
var resizeTimeout;
window.onresize = function (e) {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    window.resizeTo(100, 230);
  }, 200);
};
