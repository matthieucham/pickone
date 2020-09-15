import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/messaging";
import "firebase/analytics";

var config = {
    // backendAPI: "https://us-central1-pickone-2e023.cloudfunctions.net",
    backendAPI: "http://localhost:5001/pickone-2e023/us-central1",
    apiKey: "AIzaSyDhxWX4E-sqyiFMR7qCiPcLlTLGBUmKrGM",
    authDomain: "pickone-2e023.firebaseapp.com",
    databaseURL: "https://pickone-2e023.firebaseio.com",
    projectId: "pickone-2e023",
    storageBucket: "pickone-2e023.appspot.com",
    messagingSenderId: "28900020747",
    appId: "1:28900020747:web:353d29adb6671033262d0e",
    measurementId: "G-E60DX12D28",
    vapidKey: "BCdggOKCGJfHLlz_Or_KEElxoo_XhPyvGnqxzxG1__qfulfrqx5ffVIR3XIKhyh0q-taxgW9vrBhce2mS47SCiQ"
}
firebase.initializeApp(config);

export const backendAPIEndpoint = config.backendAPI;

const messaging = firebase.messaging();
const analytics = firebase.analytics();

export const getMessagingToken = () => new Promise((resolve, reject) => {
    messaging.getToken({ vapidKey: config.vapidKey })
        .then((firebaseToken) => {
            resolve(firebaseToken);
        })
        .catch((err) => {
            reject(err);
        });
});

export const onMessageListener = () =>
    new Promise((resolve) => {
        messaging.onMessage((payload) => {
            resolve(payload);
        });
    });

export default firebase;