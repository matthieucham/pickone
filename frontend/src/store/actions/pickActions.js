export const createPick = (pick) => {
    return (dispatch, getState, { getFirebase, getFirestore, getAPIService }) => {
        // make async call to db
        dispatch({ type: "FETCH_START" })
        const api = getAPIService();
        // TODO 
        const user = this.props.user;
        api.callAPIWithAuth(
            'picks/',
            user.idToken,
            {
                method: 'POST',
                body: JSON.stringify({ ...pick }),
                headers: {
                    'content-type': 'application/json'
                }
            }
        ).then(() => {
            dispatch({ type: "CREATE_PICK", pick });
        }).catch((err) => {
            dispatch({ type: "CREATE_PICK_ERROR", err });
        }).finally(() => {
            dispatch({ type: "FETCH_DONE" });
        })
    }
}