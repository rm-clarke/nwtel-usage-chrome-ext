'use strict';
chrome.browserAction.onClicked.addListener(function(tab) { 
    chrome.storage.sync.get({
        mac_address: ''
      }, function(items) {
        // If MAC address option has been set go to usage page - otherwise go to options page to set MAC address.
        if(items.mac_address.length > 0){
            chrome.tabs.create({ url: "https://ubbapps.nwtel.ca/cable_usage/secured/index.jsp" });
        } else {
            chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
        }
    });
});
