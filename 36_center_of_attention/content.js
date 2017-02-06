function creep(){
  $(document.body).find('.topped').each(function (){

    var windowTop = $(window).scrollTop();
    var windowHeight = $(window).height();
    var windowBottom = windowTop + windowHeight;
    var thisTop = $(this).offset().top;
    var thisHeight = $(this).height();
    var thisBottom = thisTop + thisHeight;

    if (thisTop > windowTop && thisBottom < windowBottom){
      var centerX = $(window).scrollLeft() + ($(window).width() / 2);
      var centerY =  windowTop + (windowHeight / 2);

      var thisCenterX = $(this).offset().left + ($(this).width() / 2);
      var thisCenterY = thisTop + (thisHeight / 2);

      var currentTop = parseInt($(this).css('top'), 10);
      var currentLeft = parseInt($(this).css('left'), 10);
      var topDelta = Math.abs(currentTop - centerY) / 200;
      var leftDelta = Math.abs(currentLeft - centerX) / 200.;



      if (thisCenterY > centerY){
        $(this).css('top', currentTop - topDelta);
      } else if (thisCenterY < centerY){
        $(this).css('top', currentTop + topDelta);
      }

      if (thisCenterX > centerX){
        $(this).css('left', currentLeft - leftDelta);
      } else if (thisCenterX < centerX){
        $(this).css('left', currentLeft + leftDelta);
      }
    }
  });

  setTimeout(creep, 1000);
}

function pinElts(){
  $(document.body).find(':visible:not(:has(*))').each(function (){
    if ($(this).height() < $(window).height()/2 && $(this).width() < $(window).width()/2){
      if (!$(this).hasClass('topped')){
        var parent = this.parentElement;
        $(parent).height($(parent).height());
        $(parent).width($(parent).width());

        $(this).addClass('topped');
        var thisTop = $(this).offset().top;
        var thisLeft = $(this).offset().left;
        $(this).css({
          'position': 'absolute',
          'top': thisTop,
          'left': thisLeft
        });
      }
    }
  });
  creep();
}

pinElts();
