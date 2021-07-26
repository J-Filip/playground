// ISS

// when start clicked, fire function getjson with iss api and chenge button to STOP. Else, stop function and change button to START
let startISS = document.querySelector(".start-iss");
startISS.addEventListener("click", function () {
  event.preventDefault();
  if (startISS.innerHTML === "START") {
    getJson("https://api.wheretheiss.at/v1/satellites/25544");
    startISS.innerHTML = "STOP";
  } else {
    clearTimeout(t);
    startISS.innerHTML = "START";
  }
});

// gets json from api, create marker for ISS and update location every x seconds
let firstTime = true;
async function getJson(api_url) {
  let response = await fetch(api_url);
  let data = await response.json();

  //console.log(data);
  // destructuring uuuu
  const { name, latitude, longitude, id } = data;
  // option 1 - create elements
  //document.querySelector('.fetched-div-learning').innerHTML += (`Name: ${name} <br>ID:${id} <br> Longitude: ${longitude} `);
  // option 2 - place them in html skeleton
  document.getElementById("iss-name").innerText = name;
  document.getElementById("iss-id").innerText = id;
  document.getElementById("iss-latitude").innerText = latitude;
  document.getElementById("iss-longitude").innerText = longitude;

  marker.setLatLng([latitude, longitude]);
  if (firstTime) {
    mymap.setView([latitude, longitude], 4);
    firstTime = false;
  }
  getCountry(latitude, longitude);
  // calls itself after updating DOM every 7 sec
  t = setTimeout(() => getJson(api_url), 7000);
}
// challenge - get it to NOT create new marker popup if display stays the same
async function getCountry(lat, lon) {
  let response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
  );
  let data = await response.json();
  //console.log(data);
  const { display_name } = data;
  if (display_name === undefined) {
    //console.log('nije definirano');
    markerPopup = marker
      .bindTooltip(
        `<b>Look up !</b><br>My name is ISS. I am currently flying over: <strong>Oops! No man's land...!</strong>`
      )
      .openTooltip();
  } else {
    markerPopup = marker
      .bindTooltip(
        `<b>Look up !</b><br>My name is ISS. I am currently flying over: <strong>${display_name}</strong>`
      )
      .openTooltip();
  }
}

//getJson('https://api.wheretheiss.at/v1/satellites/25544')