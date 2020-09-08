export const signIn = (credentials) => {
    return (dispatch, getState, { getFirebase }) => {
        dispatch({ type: "FETCH_START" })
        const firebase = getFirebase();
        firebase.auth().signInWithEmailAndPassword(
            credentials.email,
            credentials.password
        ).then(() => {
            dispatch({ type: "LOGIN_SUCCESS" })
        }).catch((err) => {
            dispatch({ type: "LOGIN_ERROR", err })
        }).finally(() => {
            dispatch({ type: "FETCH_DONE" })
        });
    }
}

export const signOut = () => {
    return (dispatch, getState, { getFirebase }) => {
        dispatch({ type: "FETCH_START" })
        const firebase = getFirebase();
        firebase.auth().signOut().then(() => {
            dispatch({ type: "SIGNOUT_SUCCESS" })
        }).finally(() => {
            dispatch({ type: "FETCH_DONE" })
        });
    }
}