// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyAapGXmcjU7MF1hM1VQi7NGBk47SThjrk0",
  authDomain: "gaming-test-dbc0f.firebaseapp.com",
  projectId: "gaming-test-dbc0f",
  storageBucket: "gaming-test-dbc0f.appspot.com",
  messagingSenderId: "365980714827",
  appId: "1:365980714827:web:296808a8a2a05183e98ace",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notiData = JSON.parse(payload.data.body);

  let userData = localStorage.getItem("user-data");
  userData.data.total_coins = notiData.total_coins;

  localStorage.setItem("user-item", userData);

  setTimeout(() => {
    window.location.reload();
  }, 200);
});
