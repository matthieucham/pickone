export const cleanupDb = () => {
    return (dispatch, getState, { getFirebase, getFirestore, getAPIService }) => {
        dispatch({ type: "FETCH_START" })
        const api = getAPIService();
        const firebase = getFirebase();
        firebase.auth().currentUser.getIdToken().then(idToken => {
            return api.callAPIWithAuth(
                `picks/testcleanup/`,
                idToken,
                {
                    method: 'POST',
                }
            )
        }).finally(() => {
            dispatch({ type: "FETCH_DONE" });
        })
    }
}