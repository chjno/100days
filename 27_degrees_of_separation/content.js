function getLinks(){
  var links = $('a.profileLink');
  var filtered = [];
  for (var i = 0; i < links.length; i++){
    if (links[i].pathname != window.location.pathname){
      filtered.push(links[i]);
    }
  }
  return filtered;
}

function randomLink(links){
  return links[Math.floor(Math.random()*links.length)];
}


function init(){
  var links = getLinks();

  if (links.length > 0){
    var link = randomLink(links);
    console.log(link);
    link.click();
  } else {
    window.scrollTo(0,document.body.scrollHeight);
    setTimeout(init, 500);
  }
  
}

init();
