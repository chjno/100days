var getUserElts = function(){
  var children = [];
  var elts = document.getElementsByClassName('_5va4');
  return elts;
};

var parseNames = function(userElts){
  var names = [];
  for (var i = 0; i < userElts.length; i++){
    var child = userElts[i].getElementsByTagName('a')[0];
    var text = child.innerText || child.textContent;
    names.push(text);
  }
  return names;
};

var tallyNames = function(names){
  var tallies = [];
  for (var i = 0; i < names.length; i++){
    if (tallies.hasOwnProperty(names[i])){
      tallies[names[i]]++;
    } else {
      tallies[names[i]] = 1;
    }
  }
  tallies.sort(function (a, b) {
    return a - b;
  });
};

var tallyNames = function(names){
  var nameArr = [];
  var tallies = [];
  for (var i = 0; i < names.length; i++){
    var index = nameArr.indexOf(names[i]);
    if (index == -1){
      nameArr.push(names[i]);
      var obj = {};
      obj.name = names[i];
      obj.tally = 1;
      tallies.push(obj);
    } else {
      tallies[index].tally++;
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

var update = function(div){
  var elts = getUserElts();
  var names = parseNames(elts);
  var tallies = tallyNames(names);
  showTallies(tallies);
};

var detectChanges = function(){
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var elts = getUserElts();
      var names = parseNames(elts);
      var tallies = tallyNames(names);
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
  myDiv.setAttribute('style', 'position: fixed; top: 50px; left: 10px; color: red;');
  document.body.appendChild(myDiv);

  update(myDiv);

  detectChanges();
};

init();
