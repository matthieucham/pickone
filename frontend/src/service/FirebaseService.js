// must be listed before other Firebase SDKs
const firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");

class FirebaseService {

    constructor(firebaseConfig) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        this.auth = firebase.auth();
        this.storage = firebase.storage();
        this.db = firebase.firestore();
    }

    getAuth() {
        return this.auth;
    }

    getStorage() {
        return this.storage;
    }

    getDb() {
        return this.db;
    }
}

export default FirebaseService;