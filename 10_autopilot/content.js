function autoScroll() {
  if (document.body.offsetHeight - (window.scrollY + window.innerHeight) < 100){
    // console.log('check button');
    var buttons = document.getElementsByClassName('_5usd');
    if (buttons.length > 0){
      buttons[0].click();
    }
  }
  window.scrollBy(0,2);
  scrolldelay = setTimeout(autoScroll,10);
}

autoScroll();
