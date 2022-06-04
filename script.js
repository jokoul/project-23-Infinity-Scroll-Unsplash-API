const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = []; //we declare photosArray and initialize it with an empty array

//Unsplash API
let count = 5; //For performance We start by retrieving only 5 image from the API then we will request for 30 more.
const apiKey = "OnIt--EYalZb_qMpU2uNPvgp9mQUAuYzvAm3SY1b770"; //We use an environment

let apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}`;

//Check if all images were loaded
function imageLoaded() {
  //   console.log("image loaded");
  imagesLoaded++; //to increment image loaded number which start to 0
  console.log(imagesLoaded);
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true; // we set loader attribute "hidden" to true to hide the loader div.
    console.log("ready =", ready);
    count = 10;
    apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}`;
  }
}

//Helper Function to Set Attributes on DOM Elements because we need to apply DRY principle that stand for Don't Repeat Yourself
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

//Create Elements For Links & Photos, Add to DOM
function displayPhotos() {
  imagesLoaded = 0; // reset the variable when it reach 30 photo downloaded
  totalImages = photosArray.length;
  console.log("total images", totalImages);
  //Run function for each object in photosArray
  photosArray.forEach((photo) => {
    //Create <a> to link to Unsplash
    const item = document.createElement("a"); //create an anchor empty element
    // item.setAttribute("href", photo.links.html);
    // item.setAttribute("target", "_blank");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });

    //Create <img> for photo
    const img = document.createElement("img");
    img.setAttribute("src", photo.urls.regular);
    if (photo.alt_description) {
      //   img.setAttribute("alt", photo.alt_description);
      setAttributes(img, {
        src: photo.urls.regular,
        alt: photo.alt_description,
        title: photo.alt_description,
      });
    } else if (photo.location.title) {
      //   img.setAttribute("alt", photo.location.title);
      setAttributes(img, {
        src: photo.urls.regular,
        alt: photo.location.title,
        title: photo.location.title,
      });
    } else {
      //   img.setAttribute("alt", photo.user.name);
      setAttributes(img, {
        src: photo.urls.regular,
        alt: photo.user.name,
        title: photo.user.name,
      });
    }
    // if (photo.alt_description) {
    //   img.setAttribute("title", photo.alt_description);
    // } else if (photo.location.title) {
    //   img.setAttribute("title", photo.location.title);
    // } else {
    //   img.setAttribute("title", photo.user.name);
    // }

    //Event Listener, check when each is finished loading
    img.addEventListener("load", imageLoaded);

    //Put <img> inside <a>, then put both inside imageContainer Element
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

//Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    console.log(photosArray);
    displayPhotos();
  } catch (error) {
    //Catch Error Here
  }
}

//Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener("scroll", () => {
  //   console.log("scrolled");
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    // console.log("load more");
    ready = false;
    getPhotos();
  }
});

//On Load
getPhotos();
