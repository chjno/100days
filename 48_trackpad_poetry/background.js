var poem = {
  title: '',
  body: ''
};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.req == 'add'){
    if (poem.title === ''){
      poem.title = msg.text;
    } else {
      poem.body += msg.text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '<br>') + '<br>';
    }
  } else {
    if (poem.title === ''){
      sendResponse({
        title: 'Trackpad Poetry',
        body: 'Highlight more text and come back later.'
      })
    }
    sendResponse(poem);
    poem = {
      title: '',
      body: ''
    };
  }
});
