var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {

        var divs = document.getElementsByTagName('div');
        for (var i = 0; i < divs.length; i++){
            if (divs[i].id && divs[i].id.indexOf("hyperfeed_story_id_") === 0){
                divs[i].style.visibility = 'hidden';
            }
        }
    });
});

var config = {
    attributes: true,
    childList: true,
    characterData: true
};

observer.observe(document.body, config);

var divs = document.getElementsByTagName('div');

for (var i = 0; i < divs.length; i++){
    if (divs[i].id && divs[i].id.indexOf("topnews_main_stream_") === 0){
      divs[i].style.visibility = 'hidden';
    }
}
