navigator.webkitGetUserMedia({
    audio: true,
}, function (stream) {
    stream.stop();
    console.log('stream started');
}, function () {
    console.log('stream not allowed');
});