var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        // console.log('new elements');
        // console.log(mutation)
        // if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        //     // element added to DOM
        //     console.log('new elements');
        // }

        var divs = document.getElementsByTagName('div');

        for (var i = 0; i < divs.length; i++){
            if (divs[i].id && divs[i].id.indexOf("hyperfeed_story_id_") == 0){
                // console.log(divs[i]);
                // pagerPagelet = divs[i];
                // divs[i].parentElement.removeChild(divs[i]);
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
    if (divs[i].id && divs[i].id.indexOf("topnews_main_stream_") == 0){
      divs[i].style.visibility = 'hidden';
    }
}
