'use strict';

chrome.storage.sync.get({
    max_usage: ''
  }, function(items){
    var max_usage = items.max_usage
    
    var daily_usage = []
    var days = []

    // Grab all td elements so days and daily usage can be parsed
    var elements = document.getElementsByTagName("td")

    // Starting with the 3rd index and every 7th thereafter to get days
    var k = 0;
    for(var i=3; i<elements.length; i=i+7){
        days[k] = elements[i].innerText.split(" ")[0];
        k++;
    }
    //console.log("Days:", days)

    // Starting with the 6th index and every 7th thereafter to get daily usage
    var k = 0;
    for(var i=6; i<elements.length; i=i+7){
        daily_usage[k] = elements[i].innerText.split(" ")[0];
        k++;
    }

    // Create link to chart anchor
    var new_element = document.createElement("a");
    var element = document.getElementsByTagName("p")[3];       
    new_element.href = "#chart" 
    var node = document.createTextNode("View chart");
    new_element.appendChild(node);
    element.parentNode.insertBefore(new_element, element.nextSibling);

    // Create chart div
    var new_element = document.createElement("div");
    var element = document.getElementsByTagName("body")[0];       
    new_element.className = "chart-container" 
    new_element.style = "position: relative; height:25vh; width:100vw; width: 60%; margin: 0 auto;"
    var node = document.createTextNode("");
    new_element.appendChild(node);
    element.appendChild(new_element);

    // Create anchor for chart
    var new_element = document.createElement("a");
    var element = document.getElementsByClassName("chart-container")[0];       
    new_element.name = "chart" 
    new_element.appendChild(node);
    element.appendChild(new_element);

    // Create canvas for chart
    var new_element = document.createElement("canvas");
    var element = document.getElementsByClassName("chart-container")[0];       
    new_element.id = "myChart" 
    var node = document.createTextNode("");
    new_element.appendChild(node);
    element.appendChild(new_element);

    // Chart creation code to be injected
    var code_injection = `var monthly_total_usage = ${max_usage}
    var days = [${ days }]
    var daily_usage = [${ daily_usage }]
    function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }
    var date = new Date()
    var days_this_month = daysInMonth(date.getMonth()+1,date.getFullYear())
    var total_usage = []
    var daily_allowed_usage = monthly_total_usage / days_this_month
    var daily_allowed_total_usage = []
    for(var i=0; i<days.length; i++){
        if(i>0){
            daily_allowed_total_usage[i] = daily_allowed_total_usage[i-1] + daily_allowed_usage
        } else {
            daily_allowed_total_usage[i] = daily_allowed_usage
        }
    }
    for(var i=0; i<days.length; i++){
        if(i>0){
            total_usage[i] = total_usage[i-1] + daily_usage[i]
        } else {
            total_usage[i] = daily_usage[i]
        }
    }
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Total data usage (GB)',
                data: total_usage,
                backgroundColor: [
                    'rgba(113,193,253, 0)'
                ],
                borderColor: [
                    'rgba(113,193,253, 1)'
                ],
                borderWidth: 3
            },
            {
                label: 'Daily usage (GB)',
                data: daily_usage,
                backgroundColor: [
                    'rgba(255,195,121, 0)'
                ],
                borderColor: [
                    'rgba(255,195,121, 1)'
                ],
                borderWidth: 3
            },
            {
                label: 'Usage allotment distribution (${max_usage}GB)',
                data: daily_allowed_total_usage,
                backgroundColor: [
                    'rgba(200, 200, 200, 0)'
                ],
                borderColor: [
                    'rgba(128, 128, 128, 1)'
                ],
                borderWidth: 3
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Usage (GB)'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Day of month'
                      }
                }]
            }
        }
    });`
    
    // Helper function to ensure script loaded before code execution
    function loadScript(scriptUrl) {
        const script = document.createElement('script');
        script.src = scriptUrl;
        document.body.appendChild(script);
        
        return new Promise((res, rej) => {
          script.onload = function() {
            res();
          }
          script.onerror = function () {
            rej();
          }
        });
      }
      
      // Injects code after Chart.js has been loaded
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js')
        .then(() => {
            //console.log('Script loaded!');
            var script = document.createElement('script');
            script.textContent = code_injection;
            (document.head||document.documentElement).appendChild(script);
            script.remove();
        })
        .catch(() => {
          console.error('Script loading failed! Handle this error');
        });
    
  });
