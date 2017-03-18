$(function (){
  // $('body').click(function (e){
  //   var tag = e.target.tagName.toLowerCase();
  //   if (tag == 'a'){
  //     e.preventDefault();
  //     var el = e.target;
  //     var text = el.innerText;
  //     var domain = window.location.hostname;
  //     var href = el.href;
  //     if (href.indexOf('/') === 0){
  //       href = domain + href;
  //     }
  //     var link = {
  //       domain: domain,
  //       href: href,
  //       text: text
  //     };
  //     chrome.runtime.sendMessage({type: 'link', link: link});
  //     console.log(href);
  //     console.log(text);
  //   }
  //   // chrome.runtime.sendMessage({type: 'link', link: e});
  // });
});


var tagCount = 0;
$('a').mouseover(function (e){
  var el = e.target;
  console.log(el.className);
  // if (el.className.indexOf('ducked') == -1){
  if (el.id.indexOf('duck') == -1){
    el.id = tagCount + '-duck';
    tagCount++;
  }
    // $(el).addClass('ducked');
    var text = el.innerText;
    var domain = window.location.hostname;
    var href = el.href;
    if (href.indexOf('/') === 0){
      href = domain + href;
    }
    var link = {
      id: el.id,
      domain: domain,
      href: href,
      text: text
    };
    chrome.runtime.sendMessage({type: 'link', a: link});
    console.log(href);
    console.log(text);
  // }
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  console.log(msg);
  if (msg.type == 'title'){
    modTitle(msg);
  }
});

function modTitle(msg){
  var el = document.getElementById(msg.id);
  // if (el.className.indexOf('titled') == -1){
    el.title = msg.text;
    // $(el).addClass('titled');
    var elHeight = $(el).height();
    if ( $(document).height() - $(window).scrollTop() - $(window).height() >= elHeight ){
      scrollBy(0, elHeight);
      scrollBy(0, -elHeight);
    } else if ( $(window).scrollTop() > elHeight ){
      scrollBy(0, -elHeight);
      scrollBy(0, elHeight);
    } else {
      scrollBy(0,1);
      scrollBy(0,-2);
      scrollBy(0,1);
    }

  // } else {
  //   el.title += '\n' + msg.text;
  // }
}


// var tagCount = 0;
// $('a').mouseover(function (e){
//   var el = e.target;
//   // console.log(el.className);
//   if (el.className.indexOf('gotted') == -1){
//     el.id = tagCount + '-gotted';
//     tagCount++;
//     $(el).addClass('gotted');
//     var domain = window.location.hostname;
//     var href = el.href;
//     if (href.indexOf('/') === 0){
//       href = domain + href;
//     }
//     var link = {
//       id: el.id,
//       href: href
//     };
//     chrome.runtime.sendMessage({type: 'link', a: link});
//     // console.log(href);
//     // console.log(text);
//   }
// });

// chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
//   console.log(msg);
//   if (msg.type == 'title'){
//     modTitle(msg);
//   }
// });

// function modTitle(msg){
//   var el = document.getElementById(msg.id);
//   // if (el.className.indexOf('titled') == -1){
//     el.title = msg.text;
//     // $(el).addClass('titled');
//   // } else {
//   //   el.title += '\n' + msg.text;
//   // }
// }