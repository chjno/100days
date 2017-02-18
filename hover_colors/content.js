$('a').hover(onMouseEnter, onMouseLeave);

var colorTimeout;
// var prevCss = {};
function onMouseEnter(e){
  var el = e.target;

  // prevCss[el] = el.style;

  function changeColor(){
    el.style.color = randColor();
    el.style.backgroundColor = randColor();
    colorTimeout = setTimeout(changeColor, 10);
  }

  changeColor();
}

function onMouseLeave(e){
  var el = e.target;
  clearTimeout(colorTimeout);
  // if (prevCss.hasOwnProperty(el)){
  //   el.style = prevCss[el];
  // } else {
    el.removeAttribute('style');
  // }
}

function randColor(){
  return 'rgb(' + randInt(0,256) + ',' + randInt(0,256) + ',' + randInt(0,256) + ')';
}

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// $('a:visited').each(function (){
//   this.style.color = randColor();
//   this.style.backgroundColor = randColor();
// });

// $('a').click(function (e){
//   var el = e.target;

//   el.style.color = randColor();
//   el.style.backgroundColor = randColor();
// });

// var getTextNodesIn = function(el) {
//   return $(el).find(":not(iframe)").addBack().contents().filter(function() {
//     return this.nodeType == 3;
//   });
// };
