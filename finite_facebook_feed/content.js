var scrollMax = 10000;

var scrollPosition = 0;
var processing = false;

window.addEventListener('scroll', function (e){
  scrollPosition = window.scrollY;
  if (!processing){
    window.requestAnimationFrame(function (){
      if (scrollPosition > scrollMax){
        window.scrollTo(0, scrollMax);
      }
      processing = false;
    });
  }
  processing = true;
});