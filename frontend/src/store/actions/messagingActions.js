import React from "react";
import { toast } from "react-toastify";
import NotificationToast from "../../components/lib/NotificationToast";

export const sendToken = (token) => {
    console.log(token);
    return (dispatch, getState, { getFirebase, getFirestore, getAPIService }) => {
        const api = getAPIService();
        const firebase = getFirebase();
        firebase.auth().currentUser.getIdToken().then(idToken => {
            return api.callAPIWithAuth(
                `picks/pushtokens/`,
                idToken,
                {
                    method: 'POST',
                    body: token,
                    headers: {
                        'content-type': 'text/plain'
                    }
                }
            )
        }).then((response) => {
            dispatch({ type: "PUSH_MESSAGING" });
            toast(<NotificationToast appearance="success" message={`Les notifications push sont activées`} />,
                { toastId: "PUSH_MESSAGING" })
        }).catch((err) => {
            dispatch({ type: "PUSH_MESSAGING_ERROR", err });
            console.log(err);
            toast(<NotificationToast appearance="error" message={`Une erreur est survenue`} />,
                { toastId: "PUSH_MESSAGING_ERROR" })
        })
    }
}