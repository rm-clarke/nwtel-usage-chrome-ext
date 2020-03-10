chrome.storage.sync.get({
    mac_address: ''
  }, function(items) {
    'use strict';

    // Autologin
    try {
        if(value=items.mac_address.length() > 0){
            document.getElementById('MAC').value=items.mac_address;
            document.getElementById('submit_btn').click();
        }
        
    } catch(err){
        // Not on logon page, continue.
    }

    try {
        // Get current usage for this month
        var current_usage = document.getElementsByTagName("a")[3].text.split(" ")[0];

        // Get maximum usage for plan
        var max_usage = document.getElementsByTagName("td")[1].innerText.split(" ")[0];

        // Date calculations
        var date = new Date();
        var first_day = new Date(date.getFullYear(), date.getMonth(), 1);
        var last_day = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        // Unix time calculations
        var unix_now = Math.round(date.getTime()/1000);
        var unix_start_of_month = Math.round(first_day.getTime()/1000);
        var unix_end_of_month = Math.round(last_day.getTime()/1000);

        // Months in seconds calculations
        var seconds_in_month = unix_end_of_month - unix_start_of_month;
        var seconds_into_month = unix_now - unix_start_of_month;
        var percent_month_completed = seconds_into_month / seconds_in_month;

        // Calculate expected usage for this point of month
        var expected_usage = max_usage * percent_month_completed;

        // Positive indicates available cap - negative indicates overusage
        var usage_difference = (expected_usage - current_usage).toFixed(1);

        // Generate usage projection
        var usage_projection = (current_usage / percent_month_completed).toFixed(1);

        // Base style for banner
        var style = 'font-size:1.5em;background-color:LightGrey;border-style: outset;padding: .1em .1em .1em .1em;'

        // Generate over/under usage difference message, set style based on over or under.
        var usage_diff_text = "You are " + usage_difference + " GB under your expected usage.";
        if(usage_difference < 0){
            usage_diff_text = "You are " + (0 - usage_difference) + " GB over your expected usage.";
            style += 'color:red'
        }
        else {
            style += 'color:green'
        }

        // Add usage text to top of page
        var usage_text = usage_diff_text + " You are projected to use " + usage_projection + " GB.";
        var new_element = document.createElement("strong");
        var element = document.getElementsByTagName("p")[4];
        new_element.style.cssText = style;
        var node = document.createTextNode(usage_text);
        new_element.appendChild(node);
        element.appendChild(new_element);
    } catch(err){}
});
