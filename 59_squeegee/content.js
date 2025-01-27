$(window).on('scroll', function () {
  if (!window.requestAnimationFrame) {
    // Fallback for browsers that do not support requestAnimationFrame
    setTimeout(updateElements, 16);
  } else {
    requestAnimationFrame(updateElements);
  }
});

function updateElements() {
  $('body :visible').filter(function () {
    return ($(this).height() < $(window).height()) && ($(this).height() > 0) && ($(this).width() > 0);
  }).each(function () {
    var thisTop = $(this).offset().top;
    var winScrollTop = $(window).scrollTop();

    var delta = thisTop - winScrollTop;

    if (delta < 0) {
      if (this.style.transform === '') {
        this.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
      }

      var currentMatrix = this.style.transform;
      var matrixArr = currentMatrix.replace('matrix(', '').replace(')', '').split(', ');
      var tY = parseFloat(matrixArr[5]) - delta;

      // Generate a random rotation angle between -5 and 5 degrees
      var randomRotation = Math.random() * 10 - 5;

      this.style.transform = 'matrix(1,0,0,1,0,' + tY + ') rotate(' + randomRotation + 'deg)';
    }
  });
}