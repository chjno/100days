function stripAds(){
  $('body :not(script):contains(ad), body :not(script):contains(Ad), body :not(script):contains(aD), body :not(script):contains(AD)').each(function (){
    if ($(this.children).find(':contains(ad), :contains(Ad), :contains(aD), :contains(AD)').length === 0){
      this.innerHTML = this.innerHTML.replace(/ad/gi, '');
    }
  });
}

function observe(){

  function process(){
    stripAds();
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

stripAds();
observe();
