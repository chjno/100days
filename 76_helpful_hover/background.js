var dict = {
  // q: results
};

function duck(msg, tabId){
  var last = false;
  var words = msg.text.split(' ');

  words.sort(function (a, b){
    return b.length - a.length;
  });
  // console.log(words);

  word = words[randInt(0, words.length)];
  duckgo(word);

  // duckgo(words[0]);

  function duckduckgo(q, results){
    if (results.length > 0){
      var resultIndex = randInt(0, results.length);
      var text = results[resultIndex]['Text'];
      // var text = results[0]['Text'];
      if (text){
        // console.log(text);
        chrome.tabs.sendMessage(tabId, {type: 'title', id: msg.id, text: text});
      } else {
        var qIndex = words.indexOf(q);
        words.splice(qIndex, 1);
        // words.splice(0, 1);
        if (words.length > 0){
          word = words[randInt(0, words.length)];
          duckgo(word);
      //     duckgo(words[0]);
        }
      }
    }
  }

  function duckgo(q){
    var results;
    if (dict[q]){
      results = dict[q];
      duckduckgo(q, results);
    } else {
      $.getJSON('http://api.duckduckgo.com/?q=' + q + '&format=json', function (data){
        results = data['RelatedTopics'];
        dict[q] = results;
        duckduckgo(q, results);
      });
    }
  }
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  // console.log(msg);
  if (msg.type == 'link'){
    duck(msg.a, sender.tab.id);
  }
});

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}