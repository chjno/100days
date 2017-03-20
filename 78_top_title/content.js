$(function (){
  topTitle();
});

window.onload = function(){
  topTitle();
  observe();
};

function topTitle(){
  var args = {
    ignoreCase: true,
    ignoreStopWords: true,
    ignorePunctuation: true
  };

  var tallies = RiTa.concordance(document.body.innerText, args);

  var sortable = [];
  for (var word in tallies) {
    sortable.push([word, tallies[word]]);
  }

  sortable.sort(function(a, b) {
    return b[1] - a[1];
  });

  var titleLength = document.title.split(' ').length;

  var title = [];
  for (var i = 0; i < titleLength; i++){
    title.push(sortable[i][0]);
  }

  title = title.join(' ');
  console.log(title);
  if (document.title != title){
    document.title = title;
  }
}

function observe(){
  function process(){
    topTitle();
  }

  var timeout;
  function setDelay(){
    clearTimeout(timeout);
    timeout = setTimeout(process, 500);
  }

  var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };

  var observer = new MutationObserver(function (mutations) {
    setDelay();
  });

  observer.observe(document.body, config);
}