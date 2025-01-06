chrome.runtime.sendMessage('leftFoot');
var resizeTimeout;
window.onresize = function (e) {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        window.resizeTo(100, 100);
    }, 200);
};
