// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.19.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object

firebase.initializeApp({
    apiKey: "AIzaSyDhxWX4E-sqyiFMR7qCiPcLlTLGBUmKrGM",
    authDomain: "pickone-2e023.firebaseapp.com",
    databaseURL: "https://pickone-2e023.firebaseio.com",
    projectId: "pickone-2e023",
    storageBucket: "pickone-2e023.appspot.com",
    messagingSenderId: "28900020747",
    appId: "1:28900020747:web:353d29adb6671033262d0e",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START onBackgroundMessage]
messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    let notificationTitle;
    let notificationOptions = {
        body: 'Cliquer pour voir le résultat.'
    };
    if (payload.data.pickStatus === "TERMINATED") {
        notificationTitle = `Vote terminé : ${payload.data.pickTitle}`;
    } else if (payload.data.pickStatus === "CANCELLED") {
        notificationTitle = `Vote annulé : ${payload.data.pickTitle}`;
    }

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
// [END onBackgroundMessage]
