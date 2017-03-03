var styles = $('<style>.video-background {background: #000; position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: -99; } .video-foreground, .video-background iframe {position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;}</style>');
$('head').append(styles);
var vidbg = $('<div class="video-background"></div>');
var vidfg = $('<div class="video-foreground"></div>');
var iframe = $('<iframe src="https://www.youtube.com/embed/qREKP9oijWI?start=38&controls=0&showinfo=0&rel=0&autoplay=1&loop=1&playlist=W0LHTWG-UmQ&enablejsapi=1" frameborder="0" allowfullscreen="" id="bgvid"></iframe>');

$(vidbg).append(vidfg);
$(vidfg).append(iframe);
$('body').append(vidbg);

function vidPlaying(state){
  var arg;
  if (state){
    arg = 'playVideo';
  } else {
    arg = 'pauseVideo';
  }
  console.log($(iframe)[0]);
  $(iframe)[0].contentWindow.postMessage('{"event":"command","func":"' + arg + '","args":""}', '*');
}

vidPlaying(false);
chrome.runtime.sendMessage({type:'load'});
chrome.runtime.onMessage.addListener(function (playState, sender, sendResponse){
  if (playState){
    vidPlaying(true);
  } else {
    vidPlaying(false);
  }
});