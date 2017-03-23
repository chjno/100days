chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  console.log(msg);
  if (msg.type == 'url'){
    // geolocate(sender.tab.id, url);
    console.log('geolocate', msg.url);
  }
});