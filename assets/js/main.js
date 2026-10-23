function generateHigh() {
    return Math.floor(Math.random() * 40) + 100;
}

function generateLow(high) {
    var drop = Math.floor(Math.random() * 20) + 30;
    return high - drop;
}

// [AI-Assisted: Copilot SDK in VS Code | 2026-10-21]
// Intent: Keep the low at 6 AM, the high at 4 PM, and cool toward the next morning's low.
function createHourlyForecast(high, low) {
    const temperatures = [];

    for (let hour = 0; hour < 24; hour++) {
        let temperature;

        if (hour < 6) {
            // Cool from the previous day's 4 PM high toward today's 6 AM low.
            const progress = (hour + 8) / 14;
            temperature = high + (low - high) * progress;
        } else if (hour <= 16) {
            // Warm from the 6 AM low to the 4 PM high.
            const progress = (hour - 6) / 10;
            temperature = low + (high - low) * progress;
        } else {
            // Cool toward the next day's 6 AM low (hour 30).
            const progress = (hour - 16) / 14;
            temperature = high + (low - high) * progress;
        }

        temperatures.push(Math.round(temperature));
    }

    return temperatures;
}

const forecastCache = new Map();
const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: "long" });
// [AI-Assisted: Copilot SDK in VS Code | 2026-10-21]
// Intent: Format the selected forecast date's month for the location message.
const monthFormatter = new Intl.DateTimeFormat(undefined, { month: "long" });
const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
});

// [AI-Assisted: Copilot SDK in VS Code | 2026-10-21]
// Intent: Create stable local date keys so cached forecasts match the displayed calendar day.
function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// [AI-Assisted: Copilot SDK in VS Code | 2026-10-21]
// Intent: Start each navigable forecast week on Sunday without mutating the given date.
function getWeekStart(date) {
    const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return weekStart;
}

// [AI-Assisted: Copilot SDK in VS Code | 2026-10-21]
// Intent: Generate a forecast only once per date so revisiting a day shows the same data.
function getForecast(date) {
    const key = getDateKey(date);

    if (!forecastCache.has(key)) {
        const high = generateHigh();
        const low = generateLow(high);

        forecastCache.set(key, {
            date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            high,
            low,
            hourly: createHourlyForecast(high, low)
        });
    }

    return forecastCache.get(key);
}

const weekLabel = document.getElementById("week-label");
const locationSummary = document.getElementById("location-summary");
const seasonalMessage = document.getElementById("seasonal-message");
const weeklyForecast = document.getElementById("weekly-forecast");
const selectedDayHeading = document.getElementById("day");
const hourlyForecastList = document.getElementById("hourbyhour");
const previousWeekButton = document.getElementById("previous-week");
const nextWeekButton = document.getElementById("next-week");

let visibleWeekStart = getWeekStart(new Date());
let selectedDate = new Date();

// [AI-Assisted: Copilot SDK in VS Code | 2026-10-21]
// Intent: Keep the selected day's weekly summary button accessible and in sync with the detail view.
function updateSelectedDayButtons() {
    const selectedKey = getDateKey(selectedDate);

    weeklyForecast.querySelectorAll("button[data-date-key]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.dateKey === selectedKey));
    });
}

// [AI-Assisted: Copilot SDK in VS Code | 2026-10-21]
// Intent: Render seven cached daily summaries as responsive Bootstrap forecast cards.
function renderWeek() {
    weekLabel.textContent = "My Location";
    weeklyForecast.replaceChildren();

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const date = new Date(visibleWeekStart);
        date.setDate(date.getDate() + dayOffset);
        const forecast = getForecast(date);
        const key = getDateKey(date);
        const column = document.createElement("div");
        const button = document.createElement("button");
        const dayName = document.createElement("span");
        const dateText = document.createElement("span");
        const highText = document.createElement("span");
        const lowText = document.createElement("span");

        button.type = "button";
        button.className = "btn forecast-day w-100 h-100 text-start d-flex flex-column gap-2";
        button.dataset.dateKey = key;
        button.setAttribute("aria-pressed", String(key === getDateKey(selectedDate)));

        dayName.className = "fw-bold";
        dayName.textContent = weekdayFormatter.format(date);
        dateText.className = "small forecast-day__date";
        dateText.textContent = dateFormatter.format(date);
        highText.textContent = `High: ${forecast.high}°F`;
        lowText.textContent = `Low: ${forecast.low}°F`;

        button.append(dayName, dateText, highText, lowText);
        column.className = "col";
        column.append(button);
        button.addEventListener("click", () => {
            selectedDate = new Date(date);
            updateSelectedDayButtons();
            renderSelectedDay();
        });
        weeklyForecast.append(column);
    }
}

// [AI-Assisted: Copilot SDK in VS Code | 2026-10-21]
// Intent: Render one compact hourly card for the horizontal forecast strip.
function displayTemp(temp, hour) {
    let displayHour;

    if (hour === 0) displayHour = "12 AM";
    else if (hour < 12) displayHour = `${hour} AM`;
    else if (hour === 12) displayHour = "12 PM";
    else displayHour = `${hour - 12} PM`;

    const item = document.createElement("li");
    const card = document.createElement("div");
    const time = document.createElement("span");
    const temperature = document.createElement("span");

    item.className = "hourly-forecast__item";
    card.className = "hourly-forecast__card rounded px-2 py-3 text-center d-flex flex-column justify-content-between";
    time.className = "small text-body-secondary";
    time.textContent = displayHour;
    temperature.className = "fs-5 fw-semibold";
    temperature.textContent = `${temp}°`;

    card.append(time, temperature);
    item.append(card);
    return item;
}

// [AI-Assisted: Copilot SDK in VS Code | 2026-10-21]
// Intent: Show the selected date's high, low, and complete hourly temperature report.
function renderSelectedDay() {
    const forecast = getForecast(selectedDate);
    locationSummary.textContent = `High: ${forecast.high}°F | Low: ${forecast.low}°F`;
    seasonalMessage.textContent = `It's too hot for ${monthFormatter.format(forecast.date)}`;
    selectedDayHeading.textContent =
        `${weekdayFormatter.format(forecast.date)}, ${dateFormatter.format(forecast.date)} | ` +
        `High: ${forecast.high}°F | Low: ${forecast.low}°F`;
    hourlyForecastList.replaceChildren();

    forecast.hourly.forEach((temperature, hour) => {
        hourlyForecastList.append(displayTemp(temperature, hour));
    });
}

// [AI-Assisted: Copilot SDK in VS Code | 2026-10-21]
// Intent: Navigate through unlimited weeks while retaining each date's cached forecast.
previousWeekButton.addEventListener("click", () => {
    visibleWeekStart.setDate(visibleWeekStart.getDate() - 7);
    selectedDate = new Date(visibleWeekStart);
    renderWeek();
    renderSelectedDay();
});

nextWeekButton.addEventListener("click", () => {
    visibleWeekStart.setDate(visibleWeekStart.getDate() + 7);
    selectedDate = new Date(visibleWeekStart);
    renderWeek();
    renderSelectedDay();
});

renderWeek();
renderSelectedDay();
