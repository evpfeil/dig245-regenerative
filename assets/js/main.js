
function generateHigh() {
    return Math.floor(Math.random() * 40) + 100;
}

function generateLow(high) {
    var drop = Math.floor(Math.random() * 20) + 30;
    return high - drop;
}

function createHourlyForecast(high, low) {
    var temperatures = [];
    var currentTemp = low + Math.floor(Math.random() * 6) + 2;

    for (hour = 0; hour < 23; hour++) {
        var change;

        if (hour < 6) {
            change = Math.floor(Math.random() * 3) - hour;
        }
        else if (hour == 6) {
            currentTemp = low;
            temperatures.push(currentTemp);
        }
        else if (hour < 15) {
            var hoursLeft = 16 - hour;
            var distance = high - currentTemp;

            var targetChange = distance / hoursLeft;

            change = Math.round(targetChange) + Math.floor(Math.random() * 3) - 1;

            change = Math.max(0, change);
        }
        else if (hour == 15) {
            currentTemp = high;
        }
        else {

            var hoursLeft = 24 - hour;
            var distance = currentTemp - low;
            var targetChange = distance / hoursLeft;

            change = (Math.round(targetChange)
                + Math.floor(Math.random() * 3) - 1) * -1;
            change = Math.min(0, change) + 2;
        }
        currentTemp += change;
        currentTemp = Math.max(low, Math.min(currentTemp, high));
        temperatures.push(currentTemp);
    }
    return temperatures;
}

function displayTemp(temp, hour) {
    var displayHour;

    if (hour == 0) displayHour = "12 AM";
    else if (hour < 12) displayHour = hour + " AM";
    else if (hour == 12) displayHour = "12 PM";
    else displayHour = (hour - 12) + " PM";


    document.getElementById("hourbyhour").innerHTML +=
        `<p>${displayHour} — ${temp}°F</p>`;
}

var forecast = document.getElementById("forecast");

var daysoftheweek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var counter = 0;

forecast.addEventListener("click", () => {
    var high = generateHigh();
    var low = generateLow(high);
    var hourlyForecast = createHourlyForecast(high, low);
    var dayoftheweek = daysoftheweek[counter];

    document.getElementById("day").innerHTML =
        `<h3>${dayoftheweek} | High: ${high}ºF | Low: ${low}ºF</h3>`;
    document.getElementById("hourbyhour").innerHTML = "";
    document.getElementById("forecast").innerHTML = "See Tomorrow's Forecast";

    for (let i = 0; i < hourlyForecast.length; i++) {
        temp = hourlyForecast[i]
        hour = i

        displayTemp(temp, hour);
    }
    counter = (counter + 1) % daysoftheweek.length;

});
