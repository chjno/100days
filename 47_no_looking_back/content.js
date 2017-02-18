$(window).scroll(function (){
  $('body :visible').each(function (){
    if ($(this).offset().top - $(window).scrollTop() + $(this).height() < 0){
      $(this).remove();
    }
  });
});