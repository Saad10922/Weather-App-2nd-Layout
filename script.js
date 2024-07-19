const cityByUser = document.querySelector('#City');
const searchButton = document.querySelector('.search-btn');
const loc_btn = document.querySelector('#locbtn');
const API_key = 'a4e234f06ac906ed2817f35f306e6283';
const API_key2 = '24aa0a9d2f6801844875b9124a1a3057';

// Search button event listener
searchButton.addEventListener('click', () => {
    const cityName = cityByUser.value.trim();
    if (cityName.length === 0) {
        alert('Please enter a city name');
        return;
    }

    const Weather_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`;
    fetch(Weather_API_URL)
        .then(response => response.json())
        .then(data => getWeatherInfo(data[0].name, data[0].lat, data[0].lon))
        .catch(error => alert('An Error Occurred While Fetching the Coordinates!!! Please Check the City Name Or Try Again Later'));

    document.querySelector('.weather-data').style.display = 'block';
    cityByUser.value = '';
});

// Location button event listener
loc_btn.addEventListener('click', () => {
    getUserCoordinates();
    document.querySelector('.weather-data').style.display = 'block';
});

// Get user's coordinates
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_key}`;
            fetch(API_URL)
                .then(response => response.json())
                .then(data => {
                    const { name } = data[0];
                    getWeatherInfo(name, latitude, longitude);
                })
                .catch(() => {
                    alert("An error occurred while fetching the city name!");
                });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        }
    );
}

// Fetch weather information
function getWeatherInfo(cityName, latitude, longitude) {
    const Weather_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_key}`;
    fetch(Weather_API_URL)
        .then(response => response.json())
        .then(data => selectDates(cityName, data))
        .catch(error => alert('An Error Occurred While Fetching the Weather!!! Please try again.'));
}

// Select unique dates for forecast
function selectDates(name, data) {
    
    let currCityName = name;
    let dates = data.list;
    let uniqueDates = [];
    let uniqueObjects = [];
    
    dates.forEach(item => {
        let date = new Date(item.dt_txt);
        if (!uniqueDates.includes(date.toLocaleDateString())) {
            uniqueDates.push(date.toLocaleDateString());
            uniqueObjects.push(item);
        }
    });

    forCastingDaysHTML(currCityName, uniqueObjects);
}

// Display forecast information
function forCastingDaysHTML(name, uniqueObjects) {   
    let counter = 0;
    console.log(uniqueObjects);
    uniqueObjects.forEach((item, index) => {
        if (index == 0) {
            const currIcon = document.querySelector('.icon');
            const iconArr = Array.from(currIcon.children);
            iconArr[0].setAttribute('src', `https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`);
            iconArr[1].innerText = `${item.weather[0].description}`;
            
            const currCard = document.querySelector('.details');
            const currArray = Array.from(currCard.children);
            currArray.forEach(item1 => {
                if (item1.id == 'curr_city_date') {
                    let date = new Date(item.dt_txt);
                    item1.innerHTML = `${name} :     ${date.toLocaleDateString()}`;
                } 
                else if(item1.id=='curr_day'){
                    let date = new Date(item.dt_txt);
                    item1.innerHTML = `> ${date.toLocaleString('default', { weekday: 'long' })}`
                }
                else if (item1.id == 'curr_temp') {
                    item1.innerHTML = `Temperature: ${parseInt(item.main.temp - 273.15)}°C`;
                }
                else if (item1.id == 'curr_rain') {
                    item1.innerHTML = `Rain Prediction: ${(item.pop)*100}%`;
                }
                 else if (item1.id == 'curr_wind') {
                    item1.innerHTML = `Wind: ${item.wind.speed} M/S`;
                } else if (item1.id == 'curr_humid') {
                    item1.innerHTML = `Humidity: ${item.main.humidity}%`;
                }
            });
            return;
        }
        
        let date = new Date(item.dt_txt);
        let day= date.toLocaleString('default', { weekday: 'long' })
        let temp = (item.main.temp - 273.15).toFixed(2);
        let rain = (item.pop)*100;
        let humidity = item.main.humidity;
        let windSpeed = item.wind.speed;
        let icon = item.weather[0].icon;
        displayInCards(date.toLocaleDateString(),day, temp, rain, humidity, windSpeed, icon, counter);
        counter++;
    });
}

// Display forecast cards
function displayInCards(date,day, temp, rain, humidity, windSpeed, icon, i) {
    const listCollection = document.getElementsByTagName('li');
    const listArray = Array.from(listCollection);
   
    listArray[i].innerHTML = `
        <h3>${date}</h3>
        <h3>>${day}</h3>
        <img class="max-w-16 mt-2 mr-0 -mb-3 ml-0" src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="weather icon">
        <h4 class="mt-3 font-medium">Temp: ${temp}°C</h4>
        <h4 class="mt-3 font-medium">Rain Prediction: ${rain}%</h4>
        <h4 class="mt-3 font-medium">Wind: ${windSpeed} M/S</h4>
        <h4 class="mt-3 font-medium">Humidity: ${humidity}%</h4>
    `;
}
