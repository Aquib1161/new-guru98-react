import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAapGXmcjU7MF1hM1VQi7NGBk47SThjrk0",
  authDomain: "gaming-test-dbc0f.firebaseapp.com",
  projectId: "gaming-test-dbc0f",
  storageBucket: "gaming-test-dbc0f.appspot.com",
  messagingSenderId: "365980714827",
  appId: "1:365980714827:web:296808a8a2a05183e98ace",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const getFireToken = (setTokenFound) => {
  return getToken(messaging, {
    vapidKey:
      "BKIcN860oWmH7Lqe8XOFGSCed490OyvZaRy_hXSg2JtYMrVnVPurqhpE69FVyPv2MvePG3cTR-DdBKh0A5Gp-4U",
  })
    .then((currentToken) => {
      if (currentToken) {
        setTokenFound(currentToken);
      } else {
        setTokenFound(false);
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      // console.log(payload);
      resolve(payload);
    });
  });
