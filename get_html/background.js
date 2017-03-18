// var d;

function duck(msg, tabId){
  var last = false;
  var words = msg.text.split(' ');

  words.sort(function (a, b){
    return b.length - a.length;
  });
  console.log(words);

  word = words[randInt(0, words.length)];
  duckgo(word);

  // setTimeout(function (){
  //   duckgo(words[0]);
  // }, 200);

  function duckgo(q){
    console.log(q);
    $.get('https://duckduckgo.com/?q=' + q, function (data){
      // d = data;
      var startString = 'DDG.duckbar.add(';
      var startIndex = data.indexOf(startString) + startString.length;
      var d2 = data.substring(startIndex, data.length);
      var d3 = d2.split('})')[0] + '}';

      try{
        var obj = JSON.parse(d3);
        var results = obj['data']['RelatedTopics'];
        console.log(results);
        var resultIndex = randInt(0, results.length);
        var text = results[resultIndex]['Text'];
        // var text = results[0]['Text'];
        if (text){
          chrome.tabs.sendMessage(tabId, {type: 'title', id: msg.id, text: text});
        }
      }catch(e){
        console.log('err');
        var qIndex = words.indexOf(q);
        words.splice(qIndex, 1);
        // words.splice(0, 1);
        if (words.length > 0){
          setTimeout(function (){
            word = words[randInt(0, words.length)];
            duckgo(word);
        //     duckgo(words[0]);
          }, 200);
        }
        // else {
        //   if (!last){
        //     var domain = msg.domain;
        //     var main = domain.split('.');
        //     main = main[main.length - 2];
        //     last = true;
        //     duckgo(main);
        //   }
        // }
      }

      // words.splice(0, 1);
      // if (words.length > 0){
      //   setTimeout(function (){
      //     duckgo(words[0]);
      //   }, 200);
      // }

    });
  }
}

// function log(results){
//   console.log(results);
// }

// var words;
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  console.log(msg);
  if (msg.type == 'link'){
    // words = a.text.split(' ');
    duck(msg.a, sender.tab.id);
    // getit(msg.a, sender.tab.id);
  }
});

// function tryWord(words){
//   word = words[randInt(0, words.length)];
//   duck(word);
// }

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// function getit(a, tabId){
//   var xhr = new XMLHttpRequest();
//   xhr.onload = function () {
//     var doc = this.responseXML;
//     // console.log(doc);
//     var bod = $(doc).find('body')[0];
//     var text = bod.innerText;
//     chrome.tabs.sendMessage(tabId, {type: 'title', id: a.id, text: text});
//   };

//   xhr.open("GET", a.href);
//   xhr.responseType = "document";
//   xhr.send();
// }