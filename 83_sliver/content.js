var div = document.createElement('div');
div.id = 'sliver';

$(function (){
  chrome.runtime.sendMessage('load');

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
    $(div).css({
      'position':'static',
      'margin-top':0,
      'margin-left':msg.tabLeft,
      'width':msg.tabWidth,
      'overflow':'auto',
      'height':$(window).height()
    });
    document.body.prepend(div);
    document.body.style.overflow = 'hidden';
    document.body.style.padding = 0;

    for (var child of document.body.children){
      if (child.id != 'sliver'){
        div.append(child);
      }
    }
  });
})

window.onload = function(){
  for (var child of document.body.children){
    if (child.id != 'sliver'){
      div.append(child);
    }
  }
  document.body.prepend(div);
  document.body.style.overflow = 'hidden';
};