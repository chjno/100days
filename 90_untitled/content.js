var icon = chrome.extension.getURL('icon.png');

function blank(){
  try {
    document.getElementsByTagName('title')[0].innerHTML = '&lrm;';
  } catch (e){
    document.title = 'a';
    document.getElementsByTagName('title')[0].innerHTML = '&lrm;';
  }

  var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = icon;
  document.getElementsByTagName('head')[0].appendChild(link);
}


blank();
window.onload = function(){
  blank();
};