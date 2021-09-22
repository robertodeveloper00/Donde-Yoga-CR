"use strict";
// Selectors
// const options = document.querySelectorAll("option");
const select = document.getElementById("province-selection");
const accordionContainer = document.querySelector(".finder__accordion");

let item = document.querySelector(".finder__accordion").children;

let directions = {
  center: { lat: 9.9281, lng: -84.0907 },
  info: "Costa Rica",
};

fetch("./dondeYogaAPI.json")
  .then((res) => res.json())
  .then((data) => {
    const handleSelect = (ev) => {
      // Capture Dropdown Selection
      let selectedItem = ev.target.value;

      console.log(selectedItem);

      // Creating the HTML
      if (selectedItem === "selecciona") {
        directions.center = { lat: 9.9281, lng: -84.0907 };
        directions.info = "Costa Rica";
        initMap();
        accordionContainer.innerHTML = `
          <img src="./img/SVG/Logo.svg" alt="Logo" class="dy__logo"></img>
        `;
      } else {
        accordionContainer.innerHTML = "";
        data[selectedItem].map((studio) => {
          const itemContainer = document.createElement("div");
          itemContainer.className = "finder__accordion--item";

          const itemHeader = document.createElement("div");
          itemHeader.className = "finder__accordion--item-header";

          const itemHeading = document.createElement("h3");
          itemHeading.innerText = `${studio.name}`;

          const caretDown = document.createElement("img");
          caretDown.className = "caret-down";
          caretDown.setAttribute("src", "./img/caret-down.svg");

          const itemBody = document.createElement("div");
          itemBody.className = "finder__accordion--item-body";

          const liOne = document.createElement("li");
          liOne.innerHTML = `Sitio Web: <a href="${studio.website}" target="_blank"> ${studio.name}</a>`;
          const liTwo = document.createElement("li");
          liTwo.innerHTML = `Tel: <a href="tel:+506${studio.phoneNumber}">${studio.phoneNumber}</a>`;
          const liThree = document.createElement("li");
          liThree.innerHTML = `${studio.address}`;

          itemHeader.append(itemHeading);
          itemHeader.append(caretDown);

          itemBody.append(liOne, liTwo, liThree);

          itemContainer.append(itemHeader);
          itemContainer.append(itemBody);
          accordionContainer.append(itemContainer);
        });
      }

      // Displaying the contents onClick
      const contentItems = document.querySelectorAll(
        ".finder__accordion--item"
      );
      const itemHeaders = document.querySelectorAll(
        ".finder__accordion--item-header"
      );

      // Populate Location and InfoWindow
      for (let i = 0; i < itemHeaders.length; i++) {
        itemHeaders[i].addEventListener("click", () => {
          // Opening one item exclusively
          const activeItems = document.getElementsByClassName("active");
          for (item of activeItems) {
            item.classList.remove("active");
          }

          contentItems[i].classList.toggle("active");

          directions.center = data[selectedItem][i].directions;
          directions.info = data[selectedItem][i].name;

          initMap();
        });
      }
    };

    select.addEventListener("input", handleSelect);
  });

let marker;

function initMap() {
  let markerItem = directions.center;
  let infoWindow = new google.maps.InfoWindow({
    content: `<h3>${directions.info}</h3>`,
  });

  // Map Options
  let options = {
    zoom: 15,
    center: markerItem,
  };

  // New map
  const map = new google.maps.Map(document.getElementById("map"), options);

  // Add Marker
  marker = new google.maps.Marker({
    position: markerItem,
    map,
    title: `${infoWindow}`,
  });

  infoWindow.open(map, marker);
}
