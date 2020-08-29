// must be listed before other Firebase SDKs
const firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");
require("firebase/messaging");

class FirebaseService {

    constructor(firebaseConfig) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        this.vapidKey = firebaseConfig.vapidKey;
    }

    getVapidKey() {
        return this.vapidKey;
    }

    getMessaging() {
        if (!this.messaging) {
            this.messaging = firebase.messaging();
        }
        return this.messaging;
    }

    getAuth() {
        if (!this.auth) {
            this.auth = firebase.auth();
        }
        return this.auth;
    }

    getStorage() {
        if (!this.storage) {
            this.storage = firebase.storage();
        }
        return this.storage;
    }

    getDb() {
        if (!this.db) {
            this.db = firebase.firestore();
        }
        return this.db;
    }
}

export default FirebaseService;