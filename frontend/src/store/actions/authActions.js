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

export const signInWithGoogle = () => {
    return (dispatch, getState, { getFirebase }) => {
        dispatch({ type: "FETCH_START" })
        const firebase = getFirebase();
        firebase.login(
            { provider: 'google', type: 'redirect' }
        ).then(() => {
            dispatch({ type: "LOGIN_SUCCESS" })
        }).catch((err) => {
            dispatch({ type: "LOGIN_ERROR", err })
        }).finally(() => {
            dispatch({ type: "FETCH_DONE" })
        });
    }
}

export const linkAnonymousToGoogle = () => {
    return (dispatch, getState, { getFirebase }) => {
        dispatch({ type: "FETCH_START" })
        const firebase = getFirebase();
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().currentUser.linkWithRedirect(provider)
            .then(() => {
                firebase.auth().currentUser.reload();
                const auth = firebase.auth().currentUser;
                dispatch({ type: '@@reactReduxFirebase/LOGIN', auth });
                console.log("AFTER")
            }).then(() => {
                dispatch({ type: "REGISTER_ANONYMOUS_SUCCESS" })
            }).catch((err) => {
                dispatch({ type: "REGISTER_ANONYMOUS_ERROR", err })
            }).finally(() => {
                dispatch({ type: "FETCH_DONE" })
            });
    }
}

export const createAccount = ({ email, password, displayName }) => {
    return (dispatch, getState, { getFirebase }) => {
        dispatch({ type: "FETCH_START" })
        const firebase = getFirebase();
        firebase.auth().createUserWithEmailAndPassword(
            email,
            password
        ).then((response) => {
            response.user.updateProfile({ displayName: displayName });
        }).then(() => {
            dispatch({ type: "CREATE_ACCOUNT_SUCCESS", displayName: displayName })
        }).catch((err) => {
            dispatch({ type: "CREATE_ACCOUNT_ERROR", err })
        }).finally(() => {
            dispatch({ type: "FETCH_DONE" })
        });
    }
}

export const registerAnonymous = ({ email, password, displayName }) => {
    return (dispatch, getState, { getFirebase }) => {
        dispatch({ type: "FETCH_START" })
        const firebase = getFirebase();
        const credential = firebase.auth.EmailAuthProvider.credential(email, password);
        firebase.auth().currentUser.linkWithCredential(
            credential
        ).then((response) => {
            response.user.updateProfile({ displayName: displayName });
        }).then(() => {
            firebase.auth().currentUser.reload();
            const auth = firebase.auth().currentUser;
            dispatch({ type: '@@reactReduxFirebase/LOGIN', auth });
        }).then(() => {
            dispatch({ type: "REGISTER_ANONYMOUS_SUCCESS" })
        }).catch((err) => {
            dispatch({ type: "REGISTER_ANONYMOUS_ERROR", err })
        }).finally(() => {
            dispatch({ type: "FETCH_DONE" })
        });
    }
}