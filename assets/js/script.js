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

    
// if no city is typed into the search bar then a modal will pop up to warn the user that they need to enter a city to search
    if (city == '') {
        modal.style.display = "block";
        span.onclick = function() {
            modal.style.display = "none";
          }
          return;
// otherwise if the city typed in has not been searched before (checking the searchistory array), then it will be added to local storage and rendered to the recent locations section of the site
    } else if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem("search-history", JSON.stringify(searchHistory));
        renderSearchedLocations();
    }
    // below clears the search box
    searchLocation.value = '';
    // the city name is passed into the getEvent Data function
    getEventData(city);
}

// this function fetched and retrieves the event data from the ticketmaster API for the city searched
function getEventData(city) {
// setting the style of the page, removing the lareg hero image so that the events can be seen easily by the user
    heroIMG.style.display = 'none';
    eventArea.style.display = 'block';


    var ApiKey = "4db81rdb04josQtHYUOrwdd1xDS604iA";
// query URL for the ticketmaster API
    var queryURL = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=GB&city=${city}&radius=5&unit=miles&size=5&apikey=${ApiKey}`
   
// fetching the data from the ticketmaster API for the searched city
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        // then this information will be passed into the renderEventData function to specify the data we want to access and render to the site 
        .then(function (data) {
            renderEventData(data);
        })

};

// this function selects the required information provided by the ticketmaster(TM) API and renders the information to the site for the user to see
function renderEventData(eventData) {
// settting a constant that will access the part of the TM API where the data we required is located
    const eventInfo = eventData._embedded.events;
    // then console logging the data so that we can easily refer to it, to write the code below that will render the data
    console.log(eventInfo);
// defining the area ion the HTML where the data will render to
    const eventList = document.getElementById("currentEvents");
    eventList.innerHTML = '';
// this array will hold the lattitude and longitude info that will pass into the google maps API to place markers on the map for the events location
    const markers = [];
    console.log(markers);
    
// this for loop will run for a length of 5, as this is the maximum number of events we want to retrieve data for, it will then render the specified data for each event to the HTML
    for (let i = 0; i < maxEvents; i++) {
        // defining i as the eventinfo constant from earlier and setting a new constant to pass into the following code 
        const dailyEvents = eventInfo[i];
        // setting constants to retrieve the specific data from the returned API data
        const eventImage = `${dailyEvents.images[0].url}`;

        const eventName = "<b>Event:</b> " + `${dailyEvents.name}`;

        const eventVenue = "<b>Venue:</b> " + `${dailyEvents._embedded.venues[0].name}`;

        const eventDate = "<b>Date:</b> " + new Date(`${dailyEvents.dates.start.localDate}`).toDateString();
        const eventTime = "<b>Start time:</b> " + `${dailyEvents.dates.start.localTime}`
        const eventPostcode = "<b>Postcode:</b> " + `${dailyEvents._embedded.venues[0].postalCode}`;
        const eventURL = `${dailyEvents.url}`

        // location data for each event and pushing this into the markers array
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

        // creating the divs and classes for each piece of data to render to the HTML

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
// calling the initmap function
    initMap(markers);
}

// this function places a marker on a google map display for each event using the lattitude and longitude data
function initMap(markers) {

    // The location of Greenwich
    const greenwich = { lat: 51.4934, lng: 0.0098 };

    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: greenwich,
    });
//for loop to place the markers using the markers array data
    // Create markers.
    for (let i = 0; i < markers.length; i++) {
        const marker = new google.maps.Marker({
            position: markers[i].position,
            map: map,
        });
    }
};

// gets the recently searched cities from local storage

function getSearchHistory() {
// will call the rendersearchedlocations function if there are recent searched in the local storage
    if (localStorage.getItem("search-history")) {
        searchHistory = JSON.parse(localStorage.getItem("search-history"));
        console.log(searchHistory);
        renderSearchedLocations();
// if not then it will display that there are no recent searches
    } else {
        console.log("no recent searches");
        document.getElementById("recent-locations").textContent = " No recently searched locations"
    };

};

// takes the saved cities from the search history array and displays them in the HTML

function renderSearchedLocations() {

    const locationList = document.getElementById("recent-locations");

    locationList.innerHTML = '';

    // for loop to create a new div for each city saved in the searchhistory array

    for (i = 0; i < searchHistory.length; i++) {

        const recentLocation = document.createElement('div');
        recentLocation.textContent = searchHistory[i];
        recentLocation.addEventListener('click', onClickLocation);
        console.log(recentLocation);


        locationList.appendChild(recentLocation);

    }
}

// this creates an 'eventlistener', that will take the city that has been targeted in the recent search list and will pass the city into the get event data, to fetch and render the data for that city

function onClickLocation(event) {

    const cityName = event.target.textContent
    getEventData(cityName);
}

// makes sure that the search histiry is checked on page load, so that any saved searched are then displayed on the page

getSearchHistory();

//event listener for the search button
searchBtn.addEventListener('click', getLocation);
