'use strict';



chrome.storage.sync.get({
    mac_address: ''
  }, function(items) {
    // Autologin
    try {
        if(items.mac_address.length > 0){
            document.getElementById('MAC').value=items.mac_address;
            document.getElementById('submit_btn').click();
        }
    } catch(err){
        // Not on logon page, continue.
    }
    try {
        var month_calc = new UsageMonthCalculator();
        var usage = new Usage(month_calc.percent_month_completed);
        var usage_message = new UsageMessage(usage);
        new MessageElement(usage_message);
    } catch(err){ throw err}
});

class MessageElement {
    constructor(usage_message){
        var new_element = document.createElement("strong");
        var element = document.getElementsByTagName("p")[4];
        new_element.style.cssText = usage_message.style;
        var node = document.createTextNode(usage_message.text);
        new_element.appendChild(node);
        element.appendChild(new_element);
    }
}

class UsageMessage {
    constructor(usage){
        this.setBaseStyle();
        this.setMessage(usage.difference);
        this.addProjectionMessage(usage);
    }

    setBaseStyle(){
        this.style = 'font-size:1.5em;';
    }

    addProjectionMessage(usage){
        this.text += "You are projected to use " + usage.projection + " GB.";
    }

    setMessage(usage_diff){
        var overUnderStr = "under";
        if(usage_diff < 0){
            overUnderStr = "over";
            this.setFontBad();
        } else {
            this.setFontGood();
        }
        this.text =  "You are " + Math.abs(usage_diff) + " GB " + overUnderStr + " your expected usage.";
    }

    setFontGood(){
        this.style += 'color:green;';
    }

    setFontBad(){
        this.style += 'color:red;';
    }
}

class UsageMonthCalculator {
    constructor(){
        // Unix time calculations
        var today = new Date();
        var unix_now = Math.round(today.getTime()/1000);
        var unix_start_of_month = Math.round((new Date(today.getFullYear(), today.getMonth(), 1)).getTime()/1000);
        var unix_end_of_month = Math.round((new Date(today.getFullYear(), today.getMonth() + 1, 0)).getTime()/1000);
        // Months in seconds calculations
        var seconds_in_month = unix_end_of_month - unix_start_of_month;
        var seconds_into_month = unix_now - unix_start_of_month;
        this.percent_month_completed = seconds_into_month / seconds_in_month;
    }
}

class Usage {
    constructor(percent_month_completed) {
        this.max = document.getElementsByTagName("td")[1].innerText.split(" ")[0];
        this.current = document.getElementsByTagName("a")[3].text.split(" ")[0];
        this.difference = ((this.max * percent_month_completed) - this.current).toFixed(1);
        this.projection = (this.current / percent_month_completed).toFixed(1);
    }
}