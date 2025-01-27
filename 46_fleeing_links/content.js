var fleeIntervals = {};
var fleeSpeeds = {};

$('a').hover(onMouseEnter, onMouseLeave);

function onMouseEnter(e) {
  var el = e.target;
  var width = $(el).width();
  var height = $(el).height();

  if (!fleeIntervals.hasOwnProperty(el)) {
    var midX = $(el).offset().left + $(el).width() / 2 - $(window).scrollLeft();
    var midY = $(el).offset().top + $(el).height() / 2 - $(window).scrollTop();
    var mouseX = e.clientX;
    var mouseY = e.clientY;

    var angle = Math.atan2(midY - mouseY, midX - mouseX);
    var dy = Math.sin(angle);
    var dx = Math.cos(angle);

    // Assign a random speed factor
    fleeSpeeds[el] = Math.random() * 3 + 1;

    function flee() {
      if (el.style.transform === '') {
        el.style.display = 'block';
        el.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
      }

      var currentMatrix = el.style.transform;
      var matrixArr = currentMatrix.replace('matrix(', '').replace(')', '').split(', ');
      var tx = parseFloat(matrixArr[4]);
      var ty = parseFloat(matrixArr[5]);

      var deltas = [tx + dx * fleeSpeeds[el], ty + dy * fleeSpeeds[el]];
      el.style.transform = 'matrix(1,0,0,1,' + deltas.join(', ') + ')';
      el.style.width = width + 'px';
      el.style.height = height + 'px';

      fleeIntervals[el] = requestAnimationFrame(flee);
    }

    fleeIntervals[el] = requestAnimationFrame(flee);
  }
}

function onMouseLeave(e) {
  var el = e.target;
  if (fleeIntervals.hasOwnProperty(el)) {
    setTimeout(function () {
      if (!$(e.target).is(':hover')) {
        cancelAnimationFrame(fleeIntervals[el]);
        delete fleeIntervals[el];
        delete fleeSpeeds[el];
      } else {
        console.log('still hovering');
        setTimeout(function () {
          onMouseLeave(e);
        }, 200);
      }
    }, 200);
  }
}