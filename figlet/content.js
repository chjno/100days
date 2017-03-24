var rid = chrome.runtime.id;
figlet.defaults({fontPath: 'chrome-extension://' + rid});

$(function (){
  $('h1,h2,h3,h4,h5,h6').each(figit);
});

var sizes = {
  'h1': '50%',
  'h2': '45%',
  'h3': '40%',
  'h4': '35%',
  'h5': '30%',
  'h6': '25%'
};

function figit(){
  var text = this.innerText;
  var tag = this.tagName.toLowerCase();

  figlet(text, 'Standard', function (err, data){
    if (err){
      console.log(err);
      return;
    }

    // console.log(font);
    // console.log(JSON.stringify(data));
    var lines = data.split('\n');
    var div = document.createElement('div');
    div.id = 'figged';
    // $(this).after(div);
    $(this).replaceWith(div);
    for (var line of lines){
      var p = document.createElement('p');
      $(p).css({
        'whiteSpace': 'pre',
        'fontSize': sizes[tag],
        'fontFamily': 'monospace',
        'margin': 0
      });
      p.innerText = line;

      div.append(p);
    }
  }.bind(this));
}

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}