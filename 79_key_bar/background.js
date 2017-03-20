var blankmark = 'http://itp.chino.kim/blankmark/icon.html';
var wins = {
  'icon': window.open(blankmark, '')
};

var alphabet = 'abcdefghijklmnopqrstuvwxyz';
for (var i = 0; i < alphabet.length; i++){
  var url = 'http://itp.chino.kim/blankmark/' + alphabet[i] + '.html';
  wins[alphabet[i]] = window.open(url, '');
}

var bookmarkIds = {
  // 'a': id
};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  if (msg.type == 'keydown'){
    letter(msg.key);
  } else if (msg.type == 'keyup') {
    blank(msg.key);
  } else if (msg.type == 'blank'){
    wins[msg.letter].close();
  }
});

function letter(key){
  if (alphabet.indexOf(key) >= 0){
    var url = 'http://itp.chino.kim/blankmark/' + key + '.html';
    chrome.bookmarks.update(bookmarkIds[key], { url: url });
  }
}

function blank(key){
  if (alphabet.indexOf(key) >= 0){
    chrome.bookmarks.update(bookmarkIds[key], { url: blankmark });
  }
}

function clearBar(){

  function updateB(bid, letter){
    chrome.bookmarks.update(bid, {
      title: '',
      url: blankmark
    }, function (b){
      // console.log('bookmark updated', bid, letter);
    });
  }

  function createB(index, letter){
    chrome.bookmarks.create({
      parentId: '1',
      index: index,
      title: '',
      url: blankmark
    }, function (b){
      // console.log('bookmark created', b.id, letter);
      bookmarkIds[letter] = b.id;
    });
  }

  chrome.bookmarks.getChildren('1', function (bookmarks){
    var toCreate = alphabet.length - bookmarks.length;
    for (var i = 0; i < alphabet.length; i++){
      var letter = alphabet[i];
      if (bookmarks[i]){
        bookmarkIds[letter] = bookmarks[i].id;
        updateB(bookmarks[i].id, letter);
      } else {
        createB(i, letter);
      }
    }
  });
}

clearBar();
