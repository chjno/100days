function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var cursors = [
  'default',
  'context-menu',
  'help',
  'pointer',
  'progress',
  'wait',
  'Selection cell',
  'crosshair',
  'text',
  'vertical-text',
  'alias',
  'copy',
  'move',
  'no-drop',
  'not-allowed',
  'all-scroll',
  'col-resize',
  'row-resize',
  'n-resize',
  'e-resize',
  's-resize',
  'w-resize',
  'ne-resize',
  'nw-resize',
  'se-resize',
  'sw-resize',
  'ew-resize',
  'ns-resize',
  'nesw-resize',
  'nwse-resize',
  'zoom-in',
  'zoom-out',
  'grab',
  'grabbing'
];

$(function (){
  var style = $('<style id="tag-cursors"></style>');
  $('head').append(style);

  var tags = [];
  $('body *').mouseover(function (e){
    var tag = e.target.tagName.toLowerCase();

    if (tags.indexOf(tag) == -1){
      tags.push(tag);

      var cursor = cursors[randInt(0, cursors.length)];
      var style = document.getElementById('tag-cursors');
      style.innerHTML += tag + ' { cursor: ' + cursor + '; }'
    };
  });
});