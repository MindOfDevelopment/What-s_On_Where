//setting all the main consts first
const ApiKey = "4db81rdb04josQtHYUOrwdd1xDS604iA";
const eventFinderBaseUrl = "https://app.ticketmaster.com/discovery/v2/"
const maxEvents = 5;

const searchLocation = document.getElementById('locationsearch')
const searchBtn = document.getElementById('search-btn');
const heroIMG = document.querySelector('.ImageContainer')
const eventArea = document.querySelector('.eventTitle')
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

//creating an array to push the search history list of cities and towns into
let searchHistory = [];

// calling the init function
init ();

// using init to dictate the initial style for the page
function init () {
    heroIMG.style.display = 'block';
    eventArea.style.display = 'none';
}

// this function is called from the event listener on the searchbtn, and takes the value typed into the search bar to check whether this city/town has been searched before
function getLocation(event) {

    event.preventDefault();
    var city = searchLocation.value;

    
// if the no city is typed into the search bar then a modal will pop up to warn the user that they need to enter a city to search
    if (city == '') {
        modal.style.display = "block";
        span.onclick = function() {
            modal.style.display = "none";
          }
          return;

    } else if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem("search-history", JSON.stringify(searchHistory));
        renderSearchedLocations();
    }
    searchLocation.value = '';
    getEventData(city);
}

function getEventData(city) {

    heroIMG.style.display = 'none';
    eventArea.style.display = 'block';


    var ApiKey = "4db81rdb04josQtHYUOrwdd1xDS604iA";

    var queryURL = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=GB&city=${city}&radius=5&unit=miles&size=5&apikey=${ApiKey}`
   // var queryURL = "../assets/js/eventResponse.json"

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            renderEventData(data);
        })

};

function renderEventData(eventData) {

    const eventInfo = eventData._embedded.events;
    console.log(eventInfo);

    const eventList = document.getElementById("currentEvents");
    eventList.innerHTML = '';

    const markers = [];
    console.log(markers);
    

    for (let i = 0; i < maxEvents; i++) {

        const dailyEvents = eventInfo[i];
        const eventImage = `${dailyEvents.images[0].url}`;

        const eventName = "<b>Event:</b> " + `${dailyEvents.name}`;

        const eventVenue = "<b>Venue:</b> " + `${dailyEvents._embedded.venues[0].name}`;

        const eventDate = "<b>Date:</b> " + new Date(`${dailyEvents.dates.start.localDate}`).toDateString();
        const eventTime = "<b>Start time:</b> " + `${dailyEvents.dates.start.localTime}`
        const eventPostcode = "<b>Postcode:</b> " + `${dailyEvents._embedded.venues[0].postalCode}`;
        const eventURL = `${dailyEvents.url}`

        // location data
        const eventLat = `${dailyEvents._embedded.venues[0].location.latitude}`
        const eventLon = `${dailyEvents._embedded.venues[0].location.longitude}`
        console.log(eventLat);
        console.log(eventLon);

        const marker =
        {
            position: new google.maps.LatLng(eventLat, eventLon),
            type: "info",
        }
        markers.push(marker);

        const newEList = document.createElement('div');
        newEList.classList.add('new-e-list');
        newEList.innerHTML = `<div class="event-info">
                 <div class="event-image">
                     <img src="${eventImage}"/>
                 </div>
                 <div class="event-name">
                     <span>${eventName}</span>
                 </div>
                 <div class="event-venue">
                     <span>${eventVenue}</span>
                 </div>
                 <div class="event-date">
                     <span>${eventDate}</span>
                 </div>
                 <div class="event-time">
                     <span>${eventTime}</span>
                 </div>
                 <div class="event-postcode">
                     <span>${eventPostcode}</span>
                 </div>
                 <div class="event-url">
                     <a href=${eventURL}>Find out more</a>
                 </div>
                 <br />
             </div>`
        eventList.appendChild(newEList);

    }

    initMap(markers);
}

function initMap(markers) {

    // The location of Greenwich
    const greenwich = { lat: 51.4934, lng: 0.0098 };

    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: greenwich,
    });

    // Create markers.
    for (let i = 0; i < markers.length; i++) {
        const marker = new google.maps.Marker({
            position: markers[i].position,
            map: map,
        });
    }
};



function getSearchHistory() {

    if (localStorage.getItem("search-history")) {
        searchHistory = JSON.parse(localStorage.getItem("search-history"));
        console.log(searchHistory);
        renderSearchedLocations();
    } else {
        console.log("no recent searches");
        document.getElementById("recent-locations").textContent = " No recently searched locations"
    };

};


function renderSearchedLocations() {

    const locationList = document.getElementById("recent-locations");

    locationList.innerHTML = '';

    for (i = 0; i < searchHistory.length; i++) {

        const recentLocation = document.createElement('div');
        recentLocation.textContent = searchHistory[i];
        recentLocation.addEventListener('click', onClickLocation);
        console.log(recentLocation);


        locationList.appendChild(recentLocation);

    }
}

function onClickLocation(event) {

    const cityName = event.target.textContent
    getEventData(cityName);
}



getSearchHistory();
searchBtn.addEventListener('click', getLocation);
