import React from "react";
import { toast } from "react-toastify";
import NotificationToast from "../../components/lib/NotificationToast";

export const deleteList = (list) => {
    return (dispatch, getState, { getFirebase, getFirestore, getAPIService }) => {
        dispatch({ type: "FETCH_START" })
        const api = getAPIService();
        const firebase = getFirebase();
        firebase.auth().currentUser.getIdToken().then(idToken => {
            return api.callAPIWithAuth(
                `picks/lists/${list.id}`,
                idToken,
                {
                    method: 'DELETE',
                }
            )
        }).then((response) => {
            dispatch({ type: "DELETE_LIST", list });
            toast(<NotificationToast appearance="success" message={`La liste ${list.name} a été supprimée`} />)
        }).catch((err) => {
            dispatch({ type: "DELETE_LIST_ERROR", list, err });
            console.error(err);
            toast(<NotificationToast appearance="error" message={`Erreur lors de la suppression de la liste ${list.name}`} />)
        }).finally(() => {
            dispatch({ type: "FETCH_DONE" });
        })
    }
}

export const createList = (data, history) => {
    return (dispatch, getState, { getFirebase, getFirestore, getAPIService }) => {
        dispatch({ type: "FETCH_START" })
        const api = getAPIService();
        const firebase = getFirebase();
        firebase.auth().currentUser.getIdToken().then(idToken => {
            return api.callAPIWithAuth(
                `picks/lists/`,
                idToken,
                {
                    method: 'POST',
                    body: JSON.stringify({ ...data }),
                }
            )
        }).then((response) => {
            dispatch({ type: "CREATE_LIST", data });
            if (history) {
                history.push(`/lists`);
            } else {
                dispatch({ type: "SHOW_SAVELIST_MODAL", show: false });
            }
            toast(<NotificationToast appearance="success" message={`La liste ${data.name} a été créée`} />)
        }).catch((err) => {
            console.error(err);
            dispatch({ type: "CREATE_LIST_ERROR", data, err });
            toast(<NotificationToast appearance="error" message={`Erreur lors de la création de la liste ${data.name}`} />)
        }).finally(() => {
            dispatch({ type: "FETCH_DONE" });
        })
    }
}

export const editList = (data, listId, history) => {
    return (dispatch, getState, { getFirebase, getFirestore, getAPIService }) => {
        dispatch({ type: "FETCH_START" })
        const api = getAPIService();
        const firebase = getFirebase();
        firebase.auth().currentUser.getIdToken().then(idToken => {
            return api.callAPIWithAuth(
                `picks/lists/${listId}`,
                idToken,
                {
                    method: 'PUT',
                    body: JSON.stringify({ ...data }),
                }
            )
        }).then((response) => {
            dispatch({ type: "EDIT_LIST", data });
            if (history) {
                history.push(`/lists`);
            } else {
                dispatch({ type: "SHOW_SAVELIST_MODAL", show: false });
            }
            toast(<NotificationToast appearance="success" message={`La liste ${data.name} a été modifiée`} />)
        }).catch((err) => {
            dispatch({ type: "EDIT_LIST_ERROR", data, err });
            console.error(err);
            toast(<NotificationToast appearance="error" message={`Erreur lors de la modification de la liste ${data.name}`} />)
        }).finally(() => {
            dispatch({ type: "FETCH_DONE" });
        })
    }
}
