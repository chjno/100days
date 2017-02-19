$(window).scroll(function (){
  $('body :visible').each(function (){
    if ($(this).offset().top - $(window).scrollTop() + $(this).height() < 0 && $(this).height() < $(window).height() / 2){
      if (this.style.transform === ''){
        this.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
      }

      var currentMatrix = this.style.transform;
      var matrixArr = currentMatrix.replace('matrix(', '').replace(')', '').split(', ');
      var tY = parseFloat(matrixArr[5]) + $(window).height();

      this.style.transform = 'matrix(1,0,0,1,0,' + tY + ')';

    }
  });
});