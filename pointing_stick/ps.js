var l = document.getElementById('l');
var m = document.getElementById('m');
var r = document.getElementById('r');
var ps = document.getElementById('ps');
var nubbing = false;
var scrolling = false;
var mx;
var my;

$(window).resize(function (){
  window.resizeTo(300,322);
});

function mousing(e){
  var x = e.clientX;
  var y = e.clientY;
  var dx = x - mx;
  var dy = y - my;

  if (nubbing){
    console.log(dx, dy);
    chrome.runtime.sendMessage({type: 'mouse', dx: dx, dy: dy});

  } else if (scrolling) {
    console.log(dx, dy);
    chrome.runtime.sendMessage({type: 'scroll', dx: dx, dy: dy});
  }
}

$('.hold').mousedown(plock);
$(window).mousemove(mousing);
$(window).mouseup(unlock);
$('.click').click(clicked);

function clicked(e){
  console.log(e.target.id);
  var divId = e.target.id;
  chrome.runtime.sendMessage({type: 'click', button: divId});
}

function plock(e){
  var divId = e.target.id;
  console.log(e.target.id);
  if (divId == 'ps'){
    console.log('nubbing');
    nubbing = true;
    mx = e.clientX;
    my = e.clientY;
  } else if (divId = 'm'){
    console.log('scrolling');
    scrolling = true;
    mx = e.clientX;
    my = e.clientY;
  }
}

function unlock(e){
  console.log('unlocked');
  chrome.runtime.sendMessage({type: 'unlock'});
  var divId = e.target.id;
  nubbing = false;
  scrolling = false;
}