var hidePosts = function(){
    var divs = document.getElementsByTagName('div');
    var first = true;
    for (var i = 0; i < divs.length; i++){
        if (divs[i].id && divs[i].id.indexOf("hyperfeed_story_id_") === 0){
            if (first){
                first = false;
                continue;
            } else {
                divs[i].style.visibility = 'hidden';
            }
        }
    }
};

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        hidePosts();
    });
});

var config = {
    attributes: true,
    childList: true,
    characterData: true
};

observer.observe(document.body, config);
hidePosts();
