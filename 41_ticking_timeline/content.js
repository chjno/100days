var then = new Date();
var degs = 0;

function checkTime(){
  var now = new Date();
  var delta = (now - then) / 1000;
  if (delta > 60.0){
    then = now;
    update();
  }
}
setInterval(checkTime, 1000);

function update(){
  degs += 30;

  $('._5pcb').find("[id*='hyperfeed_story_id_']").each(function (){
    this.style = 'transform: rotate(' + degs + 'deg);';
  });

  if (degs >= 360){
    degs = 0;
  }
}
