var getUserElts = function(){
  var elts = document.getElementsByClassName('_5va4');
  return elts;
};

var parseName = function(userElt){
  var child = userElt.getElementsByTagName('a')[0];
  var name = child.innerText || child.textContent;
  return name;
};

var getLikeElt = function(userElt){
  var parent = userElt.parentElement;
  while (parent.id.indexOf('hyperfeed_story_id_') == -1){
    parent = parent.parentElement;
    if (parent.tagName == 'body'){
      break;
    }
  }
  if (parent.id.indexOf('hyperfeed_story_id_') != -1){
    return parent.getElementsByClassName('_4arz')[0];
  }
};

var getLikeString = function(likeElt){
  if (likeElt){
    var text = likeElt.innerText || likeElt.textContent;
    return text;
  } else {
    return '0';
  }
};

var parseLikeString = function(s){
  var likes = 0;

  var hasK = function(s2){
    try {
      if (s2.indexOf('K') == -1){
        likes += parseFloat(s2);
      } else {
        likes += parseFloat(s2.split('K')[0]) * 1000;
      }
    } catch (e) {
      console.log(e);
    }
  };

  // if like string starts with a number
  if (parseInt(s[0], 10) >= 0){
    hasK(s);

  // if like string starts with a name
  } else {

    // if like string contains the word 'and'
    if (s.indexOf(' and ') != -1){
      var a = s.split(' and ');

      var names = a[0];
      var lastItem = a[1];

      likes += names.split(',').length;

      // if last element starts with a number
      if (parseInt(lastItem[0], 10)){
        hasK(lastItem.split(' ')[0]);

      // if last element is a name
      } else {
        likes += 1;
      }

    // if like string is just one name
    } else {
      likes = 1;
    }
  }
  return likes;
};

var likesFromUserElt = function(userElt){
  var likeElt = getLikeElt(userElt);
  var likeString = getLikeString(likeElt);
  var likes = parseLikeString(likeString);
  return likes;
};

var getLikes = function(){
  var userElts = getUserElts();

  var names = [];
  var tallies = [];
  // for each post
  for (var i = 0; i < userElts.length; i++){
    var userElt = userElts[i];

    // get name
    var name = parseName(userElt);
    
    // get likes
    var likes = likesFromUserElt(userElt);

    // console.log(name + ' ' + likes);
    var index = names.indexOf(name);
    if (index == -1){
      names.push(name);
      var obj = {};
      obj.name = name;
      obj.tally = likes;
      tallies.push(obj);
    } else {
      tallies[index].tally += likes;
    }
  }
  tallies.sort(sortTallies);
  return tallies;
};

var sortTallies = function(a, b) {
  if (a.tally > b.tally) {
    return -1;
  } else if (a.tally < b.tally) {
    return 1;
  }

  // Else go to the 2nd item
  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1;
  } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  } else { // nothing to split them
    return 0;
  }
};

var showTallies = function(tallies){
  myDiv.innerHTML = '';
  for (var i = 0; i < tallies.length; i++){
    var newDiv = document.createElement('div');
    newDiv.innerHTML = tallies[i].name + ': ' + tallies[i].tally + '\n';
    myDiv.appendChild(newDiv);
  }
};

var detectChanges = function(){
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var tallies = getLikes();
      showTallies(tallies);
    });
  });

  var config = {
    attributes: true,
    childList: true,
    characterData: true
  };

  observer.observe(document.body, config);
};

var init = function(){
  myDiv = document.createElement('div');
  myDiv.id = 'tallyDiv';
  // myDiv.setAttribute('style', 'position: fixed; top: 50px; left: 10px; color: red;');
  myDiv.setAttribute('style', 'position: fixed; top: 50px; left: 10px; color: red; overflow: scroll; height: 100vh;');
  document.body.appendChild(myDiv);

  var tallies = getLikes();
  showTallies(tallies);

  detectChanges();
};

init();
