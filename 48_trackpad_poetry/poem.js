chrome.runtime.sendMessage({req: 'fetch'}, function (response){
  console.log(response);
  document.title = response.title;
  document.getElementById('title').innerHTML = response.title;
  document.getElementById('body').innerHTML = response.body;
});