function editable(){
  $('body :visible').each(function (){
    if (this.tagName == 'A'){
      this.contentEditable = 'false';
    } else {
      this.contentEditable = 'true';
    }
  });
}

function observe(){

  function process(){
    editable();
  }

  var timeout;
  function setDelay(){
    clearTimeout(timeout);
    timeout = setTimeout(process, 500);
  }

  var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };

  var observer = new MutationObserver(function (mutations) {
    setDelay();
  });

  observer.observe(document, config);
}

editable();
$(function (){
  observe();
});