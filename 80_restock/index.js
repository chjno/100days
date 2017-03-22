var creds = require('./creds.js');
var Clarifai = require('clarifai');
var app = new Clarifai.App(creds.id, creds.secret);
var request = require('request');

var imageTags = {
  // original src: tag
};

var stockImages = {
  // q: array of img urls
};

window.tagImage = function(tabId, src){
  if (imageTags.hasOwnProperty(src)){
    getGeneric(tabId, src, imageTags[src]);
  } else {
    app.models.predict(Clarifai.GENERAL_MODEL, src).then(
      function (response) {
        // console.log(response);
        var data = response.data.outputs[0].data.concepts;
        var tag = data[0].name;
        imageTags[src] = tag;
        getGeneric(tabId, src, tag);
      },
      function (err) {
        console.error(err);
      }
    );
  }
};

window.getGeneric = function(tabId, original, q){
  if (stockImages.hasOwnProperty(q)){
    if (stockImages[q].length > 0){
      var images = stockImages[q];
      var index = randInt(0, images.length);
      var src = images[index].src.replace('chrome-extension://', 'https://');
      images.splice(index, 1);
      chrome.tabs.sendMessage(tabId, {type: 'generic', q: q, original: original, generic: src});
    }
  } else {
    var url = 'https://www.shutterstock.com/search?search_source=base_landing_page&language=en&image_type=photo&searchterm=' + q;

    request({url: url}, function (err, response, body) {
      if(err) { console.log(err); return; }
      // console.log("Get response: " + response.statusCode);

      var images = $(body).find('.img-wrap img');
      var index = randInt(0, images.length);
      var src = images[index].src.replace('chrome-extension://', 'https://');
      images.splice(index, 1);
      stockImages[q] = images;
      // console.log(src);
      chrome.tabs.sendMessage(tabId, {type: 'generic', q: q, original: original, generic: src});
    });
  }
};

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  // console.log(msg);
  if (msg.type == 'original'){
    tagImage(sender.tab.id, msg.src);
  }
});