var zoom = '100%';
var zoomTimeout;
var scrollTimeout;
var zoomOutInterval = 100;
var zoomInAmount = 3;

zoomTimeout = setTimeout(zoomOut, zoomOutInterval);

window.addEventListener('scroll', function (e){
  zoomIn();
});


function zoomOut(){
  zoom = (parseInt(zoom, 10) - 1) + '%';
  if (parseInt(zoom, 10) < 1){
    clearTimeout(zoomTimeout);
    return;
  }

  document.body.style.zoom = zoom;

  zoomTimeout = setTimeout(zoomOut, zoomOutInterval);
}

function zoomIn(){
  clearTimeout(scrollTimeout);
  clearTimeout(zoomTimeout);

  zoom = (parseInt(zoom, 10) + zoomInAmount) + '%';
  document.body.style.zoom = zoom;

  scrollTimeout = setTimeout(zoomOut, 100);
}