var allClasses = [];
function addClasses(){
  var unprocessed = $(':visible:not(.class-added)');
  unprocessed.each(function (){
    try{
      var classes = this.className.split(/\s+/);
      for (var c of classes){
        if (c !== '' && allClasses.indexOf(c) == -1){
          allClasses.push(c);
        }
      }
    } catch(e){
      console.log('err');
    }
  });

  unprocessed.each(function (){
    $(this).addClass(allClasses[Math.floor(Math.random()*allClasses.length)]);
    $(this).addClass('class-added');
  });
}

function observe(){
  function process(){
    addClasses();
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

addClasses();
$(function (){
  observe();
});