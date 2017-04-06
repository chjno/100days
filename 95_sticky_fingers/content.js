$(window).mousemove(function (e){
  var mouseX = e.pageX;
  var mouseY = e.pageY;

  var els = document.elementsFromPoint(e.clientX, e.clientY);

  for (var el of els){
    if (el.tagName == 'A' && el.className.indexOf('sticky-clicky') == -1){
      console.log(el.tagName);
      el.classList.add('sticky-clicky');
      el.setAttribute('originX', mouseX);
      el.setAttribute('originY', mouseY);
      el.style.display = 'inline-block';
    }
  }

  $('.sticky-clicky').each(function (){
    var originX = this.getAttribute('originX');
    var originY = this.getAttribute('originY');

    var dx = mouseX - originX;
    var dy = mouseY - originY;

    this.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
  });
});