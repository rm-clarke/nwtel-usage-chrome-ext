'use strict';
chrome.browserAction.onClicked.addListener(function(tab) { 
    chrome.storage.sync.get({
        mac_address: ''
      }, function(items) {
        if(items.mac_address.length > 0){
            var newURL = "https://ubbapps.nwtel.ca/cable_usage/secured/index.jsp";
            chrome.tabs.create({ url: newURL });
        } else {
            chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
        }
    });
});
