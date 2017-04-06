function disable(ext){
  chrome.management.setEnabled(ext.id, false);
}

chrome.management.getSelf(function (disabler){
  chrome.management.getAll(function (extensions){
    for (var ext of extensions){
      if (ext.id != disabler.id){
        disable(ext);
      }
    }
  });

  chrome.management.onEnabled.addListener(function (ext){
    disable(ext);
  });
});
