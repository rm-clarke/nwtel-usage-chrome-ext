// Saves options to chrome.storage
function save_options() {
  var mac_address = document.getElementById('mac_address').value;
  chrome.storage.sync.set({
    mac_address: mac_address,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved. Click the extension button again to go to the usage site.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    mac_address: ''
  }, function(items) {
    document.getElementById('mac_address').value = items.mac_address;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);