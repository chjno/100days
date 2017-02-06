// $(document.body).find('*').each(function (){
//   if ($(this).height() < $(window).height()){
//     var scaledScale = 1 - $(this).offset().top * .00001;
//     if (scaledScale < 0){
//       scaledScale = 0;
//     }
//     $(this).attr('style', 'transform:scale(' + scaledScale + ')');
//   }
// });


// $(document.body).find(":not([style*='transform:scale'])");

function observePage(){
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node){
        if ($(node).height() < $(window).height()){
          var scaledScale = 1 - $(node).offset().top * .00005;
          if (scaledScale < 0){
            scaledScale = 0;
          }
          $(node).attr('style', 'transform:scale(' + scaledScale + ')');
        }
      });
    });
  });

  var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };

  observer.observe(document, config);
}

function shrink(){
  // $(document.body).find(":not([style*='transform:scale'])").each(function (){
  $(document.body).find("*:visible").each(function (){
    if ($(this).height() < $(window).height()){
      var scaledScale = 1 - $(this).offset().top * .00005;
      if (scaledScale < 0){
        scaledScale = 0;
      }
      $(this).attr('style', 'transform:scale(' + scaledScale + ')');
    }
  });
}

shrink();
observePage();
