$(window).scroll(function (){
  $('body :visible').filter(function (){
    return ($(this).height() < $(window).height()) && ($(this).height() > 0) && ($(this).width() > 0);
  }).each(function (){
    var thisTop = $(this).offset().top;
    var winScrollTop = $(window).scrollTop();

    var delta = thisTop - winScrollTop;

    if (delta < 0){
      if (this.style.transform === ''){
        this.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
      }

      var currentMatrix = this.style.transform;
      var matrixArr = currentMatrix.replace('matrix(', '').replace(')', '').split(', ');
      var tY = parseFloat(matrixArr[5]) - delta;

      this.style.transform = 'matrix(1,0,0,1,0,' + tY + ')';

      // $(this).find(':visible').filter(function (){
      //   return ($(this).height() > 0) && ($(this).width() > 0);
      // }).each(function (){
      //   if (this.style.transform === ''){
      //     this.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
      //   }

      //   var currentMatrix = this.style.transform;
      //   var matrixArr = currentMatrix.replace('matrix(', '').replace(')', '').split(', ');
      //   var tY;
      //   if ($(this).offset().top <= 0){
      //     tY = parseFloat(matrixArr[5]) - delta;
      //   } else {
      //     var innerDelta = $(this).offset().top + delta;
      //     tY = innerDelta < 0 ? parseFloat(matrixArr[5]) + delta - innerDelta : parseFloat(matrixArr[5]) + delta;
      //   }

      //   this.style.transform = 'matrix(1,0,0,1,0,' + tY + ')';
      // });
    }
  });
});