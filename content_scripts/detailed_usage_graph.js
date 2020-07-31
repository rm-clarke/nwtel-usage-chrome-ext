'use strict';

chrome.storage.sync.get({
    max_usage: ''
  }, function(items){
    var max_usage = items.max_usage
    //console.log("max_usage:",max_usage)

    var daily_usage = []
    var days = []

    var elements = document.getElementsByTagName("td")

    // 3rd + 7 split on space first element for days
    var k = 0;
    for(var i=3; i<elements.length; i=i+7){
        days[k] = elements[i].innerText.split(" ")[0];
        k++;
    }
    //console.log("Days:", days)

    // 6th + 7 split on space first element for usage
    var k = 0;
    for(var i=6; i<elements.length; i=i+7){
        daily_usage[k] = elements[i].innerText.split(" ")[0];
        k++;
    }
    //console.log("Daily usage:", daily_usage)

    // add link to chart
    var new_element = document.createElement("a");
    var element = document.getElementsByTagName("p")[3];       
    new_element.href = "#chart" 
    var node = document.createTextNode("       Go to chart");
    new_element.appendChild(node);
    element.appendChild(new_element);

    // add div to hold chart
    var new_element = document.createElement("div");
    var element = document.getElementsByTagName("body")[0];       
    new_element.className = "chart-container" 
    new_element.style = "position: relative; height:25vh; width:100vw; width: 60%; margin: 0 auto;"
    var node = document.createTextNode("");
    new_element.appendChild(node);
    element.appendChild(new_element);

    // add link to chart div
    var new_element = document.createElement("a");
    var element = document.getElementsByClassName("chart-container")[0];       
    new_element.name = "chart" 
    new_element.appendChild(node);
    element.appendChild(new_element);

    // add canvas to div
    var new_element = document.createElement("canvas");
    var element = document.getElementsByClassName("chart-container")[0];       
    new_element.id = "myChart" 
    var node = document.createTextNode("");
    new_element.appendChild(node);
    element.appendChild(new_element);

    var actualCode = `var monthly_total_usage = ${max_usage}
    //var days = [1,2,3,4,5,6,7,8,9,10]
    var days = [${ days }]
    //var daily_usage = [5,6,3,8,4,7,11,17,12,100]
    var daily_usage = [${ daily_usage }]
    // ----------------------------------------
    //console.log("yeet")
    function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }
    var date = new Date()

    var days_this_month = daysInMonth(date.getMonth()+1,date.getFullYear())

    var total_usage = []
    var daily_allowed_usage = monthly_total_usage / days_this_month
    var daily_allowed_total_usage = []

    // calculate fit line for usage
    for(var i=0; i<days.length; i++){
        if(i>0){
            daily_allowed_total_usage[i] = daily_allowed_total_usage[i-1] + daily_allowed_usage
        } else {
            daily_allowed_total_usage[i] = daily_allowed_usage
        }
    }

    // calculate daily usage
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
                label: 'Data usage (GB)',
                data: total_usage,
                backgroundColor: [
                    'rgba(0, 0, 255, 0.3)'
                ],
                borderColor: [
                    'rgba(0, 0, 255, 1)'
                ],
                borderWidth: 1
            },
            {
                label: 'Expected usage (${max_usage}GB)',
                data: daily_allowed_total_usage,
                backgroundColor: [
                    'rgba(200, 200, 200, .8)'
                ],
                borderColor: [
                    'rgba(0, 0, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });`
    

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
      
      // use
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js')
        .then(() => {
            //console.log('Script loaded!');
            var script = document.createElement('script');
            script.textContent = actualCode;
            (document.head||document.documentElement).appendChild(script);
            script.remove();
        })
        .catch(() => {
          console.error('Script loading failed! Handle this error');
        });
    
  });
