var articles = [];
var currentPage = 0;
var gettingArticles = false;

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse){
  getArticles();

  function getArticles(){
    if (gettingArticles){
      setTimeout(getArticles, 500);
      return;
    }

    gettingArticles = true;

    if (articles.length < req.num){
      var pagesNeeded = Math.ceil((req.num - articles.length) / 10.0);
      var startPage = currentPage;
      currentPage += pagesNeeded;
      var endPage = startPage + pagesNeeded - 1;
      nytCall(startPage);
    } else {
      var msg = {
        streamId: req.streamId,
        articles: articles.splice(0, req.num)
      };

      chrome.tabs.sendMessage(sender.tab.id, msg, function (response){});
      gettingArticles = false;
    }
    
    function nytCall(page){
      var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
      url += '?' + $.param({
        'api-key': key,
        'fq': "source:(\"The New York Times\")",
        'sort': "newest",
        'page': page
      });

      $.ajax({
        url: url,
        method: 'GET',
      }).done(function (result) {
        $.merge(articles, result.response.docs);
        if (page < endPage){
          nytCall(page + 1);
        } else {
          var msg = {
            streamId: req.streamId,
            articles: articles.splice(0, req.num)
          };

          chrome.tabs.sendMessage(sender.tab.id, msg, function (response){});
          gettingArticles = false;
        }
      }).fail(function (err) {
        throw err;
      });
    }
  }
});
