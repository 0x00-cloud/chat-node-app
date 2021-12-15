// const socket = io();

// socket.on("countUpdated", (count) => {
//   console.log("The count has been updated", count);
// });

// document.addEventListener("DOMContentLoaded", (event) => {
//   document.querySelector("#increment").addEventListener("click", () => {
//     console.log("clicked");
//     socket.emit("increment");
//   });
// });

//Elements
const socket = io();
const messageForm = document.querySelector("#message-form");
const messageFormInput = messageForm.querySelector("input");
const messageFormButton = messageForm.querySelector("button");
const sendLocationButton = document.querySelector("#send-location");
const messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;

const x = "dfdf";
console.log(x);
socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message,
  });
  messages.insertAdjacentHTML("beforeend", html);
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //disable
  messageFormButton.setAttribute("disabled", "disabled");
  const message = messageFormInput.value;
  socket.emit("sendMessage", message, (error) => {
    //enable

    messageFormButton.removeAttribute("disabled");
    messageFormInput.value = "";
    messageFormInput.focus();
    if (error) {
      return console.log(error);
    }

    console.log("message Delivered");
  });
});

// use geolocation api to fetch user location
sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser!");
  }

  sendLocationButton.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit("sendLocation", latitude, longitude, (responseFromServer) => {
      sendLocationButton.removeAttribute("disabled");
      console.log(responseFromServer);
    });
  });
});
