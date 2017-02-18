$(window).mouseup(function (e){
  var selected = getSelected();
  if (selected !== ''){
    chrome.runtime.sendMessage({req: 'add', text: selected});
  }
});

function getSelected() {
  var text = "";
  if (window.getSelection) {
      text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
  }
  return text;
}
