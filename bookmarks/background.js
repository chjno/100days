// var pages = {};
// var currentPage;
// chrome.tabs.query({active: true, currentWindow: true}, function (tabArray){
//   currentPage = tabArray[0].url;
//   newTimer(currentPage);
// });

// function newTimer(url){
//   pages[url] = {
//     ts: new Date(),
//     time: 0
//   };
// }

// function updatePages(){
//   var now = new Date();

//   if (pages[currentPage]){
//     pages[currentPage].time += now - pages[currentPage].ts;
//     console.log('time updated ' + currentPage + ' ' + pages[currentPage].time);
//   } else {
//     newTimer(currentPage);
//     console.log('timing new page 1 ' + currentPage);
//   }
// }

// function restartTimer(url){
//   currentPage = url;

//   if (pages.hasOwnProperty(currentPage)){
//     console.log('restarting timer on ' + url);
//     pages[currentPage].ts = new Date();
//   } else {
//     console.log('timing new page 2 ' + url);
//     newTimer(currentPage);
//   }
// }

// function checkIn(){
//   chrome.tabs.query({active: true, currentWindow: true}, function (tabArray){
//     updatePages();
//     // if (tabArray[0]){
//       restartTimer(tabArray[0].url);
//     // }
//   });
//   console.log(pages);
//   updateBookmarks();
// }

// function updateBookmarks(){
//   var sortedPages = sortPages();

//   // FIXME

// }

// function sortPages(){
//   var sortable = [];
//   for (var page in pages){
//     sortable.push([page, pages[page].time]);
//   }

//   sortable.sort(function (a, b){
//     return b[1] - a[1];
//   });

//   return sortable;
// }

// chrome.tabs.onActivated.addListener(function (activeInfo){
//   updatePages();

//   chrome.tabs.get(activeInfo.tabId, function (tab){
//     restartTimer(tab.url);
//   });
// });

// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
//   // console.log(tab);
//   if (changeInfo.status == 'complete' && tab.active){
//     updatePages();
//     restartTimer(tab.url);
//   }
// });

// chrome.webNavigation.onTabReplaced.addListener(function (details){
//   // console.log('tab replaced');
//   // console.log(details);

//   updatePages();
//   chrome.tabs.get(details.tabId, function (tab){
//     restartTimer(tab.url);
//   });
// });

// prevWindowId = 0;
// chrome.windows.onFocusChanged.addListener(function (windowId){
//   console.log(windowId);
//   if (windowId == -1){
//     if (prevWindowId != -1){
//       updatePages();
//     }
//     clearInterval(checkInterval);
//   } else {
//     if (prevWindowId == -1){
//       checkInterval = setInterval(checkIn, 15000);
//     } else {
//       updatePages();
//     }
//     chrome.tabs.query({active: true, currentWindow: true}, function (tabArray){
//       restartTimer(tabArray[0].url);
//     });
//   }
//   prevWindowId = windowId;
// });

// // chrome.idle.setDetectionInterval(15);
// // chrome.idle.onStateChanged.addListener(function (idleState){
// //   if (idleState == 'active'){
// //   } else {
// //   }
// // });

// var checkInterval = setInterval(checkIn, 15000);

// chrome.bookmarks.getSubTree('0', function (bookmarkArray){
//   var children = bookmarkArray[0].children;
//   var bbar;
//   console.log(children);
//   for (var i = 0; i < children.length; i++){
//     if (children[i].title == "Bookmarks Bar"){
//       bbar = children[i];
//       break;
//     }
//   }
//   console.log(bbar);
// });

chrome.bookmarks.getSubTree('1', function (bookmarkArray){
  var bmarks = bookmarkArray[0].children;
});


// chrome.bookmarks.search({title: 'Bookmarks Bar'}, function (bookmarkArray){
//   console.log(bookmarkArray);
// });