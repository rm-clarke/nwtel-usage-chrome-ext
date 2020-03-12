// Error page reached - reset MAC address as it is invalid for login.
chrome.storage.sync.set({
    mac_address: '',
  }, function() {});