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
    //try {
        var usage = new Usage();
        var usage_message = new UsageMessage(usage, "expected");
        new MessageElement(usage_message);
        var usage_message = new UsageMessage(usage, "projection");
        new MessageElement(usage_message);
    //} catch(err){ throw err}
});

class MessageElement {
    constructor(usage_message){
        var new_element = document.createElement("li");
        //var element = document.getElementsByTagName("p")[4];
        var element = document.getElementsByTagName("ul")[0];
        
        new_element.style.cssText = usage_message.style;
        var node = document.createTextNode(usage_message.text);
        new_element.appendChild(node);
        element.appendChild(new_element);
    }
}

class UsageMessage {
    constructor(usage, setting){
        this.setBaseStyle();
        if(setting == "projection"){
            this.setProjectionMessage(usage);
        } else if(setting == "expected"){
            this.setExpectedMessage(usage);
        }
    }

    setBaseStyle(){
        this.style = '';
    }

    setProjectionMessage(usage){
        var overUnderStr = "under";
        if(usage.difference < 0){
            overUnderStr = "over";
            this.setFontBad();
        } else {
            this.setFontGood();
        }
        this.text = "You are projected to use " + usage.projection + " GB.";
    }

    setExpectedMessage(usage){
        var overUnderStr = "under";
        if(usage.difference < 0){
            overUnderStr = "over";
            this.setFontBad();
        } else {
            this.setFontGood();
        }
        this.text =  "You are " + Math.abs(usage.difference) + " GB " + overUnderStr + " your expected usage.";
    }

    setFontGood(){
        this.style += 'color:green;';
    }

    setFontBad(){
        this.style += 'color:red;';
    }
}

class Usage {
    constructor(percent_month_completed) {
        var percent_month_completed = this.getPercentMonthCompleted();
        
        //this.max = document.getElementsByTagName("td")[1].innerText.split(" ")[0];
        this.max = document.getElementsByTagName("span")[4].innerText.split(" ")[5]
        var max_usage = this.max
        chrome.storage.sync.set({
            max_usage: max_usage,
        })
        //this.current = document.getElementsByTagName("a")[3].text.split(" ")[0];
        this.current = document.getElementsByTagName("span")[3].innerText.split(" ")[6];
        this.difference = ((this.max * percent_month_completed) - this.current).toFixed(1);
        this.projection = (this.current / percent_month_completed).toFixed(1);
    }
    
    getPercentMonthCompleted(){
        // Unix time calculations
        var today = new Date();
        var unix_now = Math.round(today.getTime()/1000);
        var unix_start_of_month = Math.round((new Date(today.getFullYear(), today.getMonth(), 1)).getTime()/1000);
        var unix_end_of_month = Math.round((new Date(today.getFullYear(), today.getMonth() + 1, 1)).getTime()/1000);
        // Months in seconds calculations
        var seconds_in_month = unix_end_of_month - unix_start_of_month;
        var seconds_into_month = unix_now - unix_start_of_month;
        
        return (seconds_into_month / seconds_in_month); 
    }
}