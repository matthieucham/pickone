import authReducer from "./authReducer";
import listReducer from "./listReducer";
import pickReducer from "./pickReducer";
import uiReducer from "./uiReducer";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";


const rootReducer = combineReducers({
    auth: authReducer,
    list: listReducer,
    pick: pickReducer,
    ui: uiReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer,
})

export default rootReducer;