var mouseX;
var mouseY;

$(window).mousemove(function (e){
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function toMouse(){
  $('a').each(function (){
    var width = $(this).width();
    var height = $(this).height();

    if (this.style.transform === ''){
      this.style.display = 'block';
      this.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
    }

    var midX = $(this).offset().left + $(this).width()/2 - $(window).scrollLeft();
    var midY = $(this).offset().top + $(this).height()/2 - $(window).scrollTop();

    var angle = Math.atan2(midY - mouseY, midX - mouseX);
    var dy = Math.sin(angle) * 10;
    var dx = Math.cos(angle) * 10;

    var currentMatrix = this.style.transform;
    var matrixArr = currentMatrix.replace('matrix(', '').replace(')', '').split(', ');
    var tx = parseFloat(matrixArr[4]);
    var ty = parseFloat(matrixArr[5]);

    var deltas = [tx - dx, ty - dy];
    this.style.transform = 'matrix(1,0,0,1,' + deltas.join(', ') + ')';
    this.style.width = width + 'px';
    this.style.height = height + 'px';
  });
}

setInterval(toMouse, 500);
