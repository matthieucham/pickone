import React from "react";
import { toast } from "react-toastify";
import NotificationToast from "../../components/lib/NotificationToast";

export const createPick = (pick, history) => {
    return (dispatch, getState, { getFirebase, getFirestore, getAPIService }) => {
        // make async call to db
        dispatch({ type: "FETCH_START" });
        const api = getAPIService();
        const firebase = getFirebase();
        firebase.auth().currentUser.getIdToken().then(idToken => {
            return api.callAPIWithAuth(
                'picks/',
                idToken,
                {
                    method: 'POST',
                    body: JSON.stringify({ ...pick }),
                }
            )
        }).then((response) => {
            dispatch({ type: "CREATE_PICK", pick });
            toast(<NotificationToast appearance="success" message={`Le vote ${pick.title} a été créé`} />)
            if (history) {
                history.push(`/pick/${response.pickId}`);
            }
        }).catch((err) => {
            console.error(err);
            dispatch({ type: "CREATE_PICK_ERROR", err });
            toast(<NotificationToast appearance="error" message={`Une erreur est survenue, le vote ${pick.title} n'a pas été créé`} />)
        }).finally(() => {
            dispatch({ type: "FETCH_DONE" });
        })
    }
}

export const joinPick = (code, name, history) => {
    return async (dispatch, getState, { getFirebase, getFirestore, getAPIService }) => {
        // make async call to db
        dispatch({ type: "FETCH_START" })
        const api = getAPIService();
        const firebase = getFirebase();
        const auth = getState().firebase.auth;
        let authUser;
        if (!auth.uid) {
            // needs anonymous signin
            authUser = await firebase.auth().signInAnonymously().then((response) => {
                response.user.updateProfile({ displayName: name });
                return response.user;
            }).then((authUser) => {
                dispatch({ type: "LOGIN_ANONYMOUS", displayName: name });
                return authUser;
            })
        } else {
            authUser = firebase.auth().currentUser;
        }
        authUser.getIdToken().then(idToken => {
            return api.callAPIWithAuth(
                'picks/registrations/',
                idToken,
                {
                    method: 'POST',
                    body: JSON.stringify({ code: code }),
                }
            )
        }).then((response) => {
            dispatch({ type: "JOIN_PICK" });
            dispatch({ type: "SHOW_JOINPICK_MODAL", show: false });
            if (history) {
                history.push(`/pick/${response.pickId}`);
            }
        }).catch((err) => {
            console.error(err);
            dispatch({ type: "JOIN_PICK_ERROR", err });
        }).finally(() => {
            dispatch({ type: "FETCH_DONE" });
        })
    }
}

export const cancelVote = (pickId, vote) => {
    return (dispatch, getState, { getFirebase, getFirestore, getAPIService }) => {
        // make async call to db
        dispatch({ type: "FETCH_START" });
        const api = getAPIService();
        const firebase = getFirebase();
        firebase.auth().currentUser.getIdToken().then(idToken => {
            return api.callAPIWithAuth(
                `picks/${pickId}/vote/${vote.id}`,
                idToken,
                {
                    method: 'DELETE',
                    body: JSON.stringify({ displayName: vote.name })
                }
            )
        }).then((response) => {
            dispatch({ type: "CANCEL_VOTE" });
            toast(<NotificationToast appearance="success" message={`Le choix de ${vote.name} a été supprimé`} />)
        }).catch((err) => {
            console.error(err);
            dispatch({ type: "CANCEL_VOTE_ERROR", err });
            toast(<NotificationToast appearance="error" message={`Une erreur est survenue, le choix de ${vote.name} n'a pas été supprimé`} />)
        }).finally(() => {
            dispatch({ type: "FETCH_DONE" });
        })
    }
}

export const updateChoices = (pickId, choices) => {
    return (dispatch, getState, { getFirebase, getFirestore, getAPIService }) => {
        dispatch({ type: "FETCH_START" });
        const api = getAPIService();
        const firebase = getFirebase();
        firebase.auth().currentUser.getIdToken().then(idToken => {
            return api.callAPIWithAuth(
                `picks/${pickId}/vote/`,
                idToken,
                {
                    method: 'PUT',
                    body: JSON.stringify({ picked: choices }),
                }
            )
        }).then((response) => {
            dispatch({ type: "UPDATE_CHOICES" });
            toast(<NotificationToast appearance="success" message={`Choix enregistrés`} />)
        }).catch((err) => {
            console.error(err);
            dispatch({ type: "UPDATE_CHOICES_ERROR", err });
            toast(<NotificationToast appearance="error" message={`Une erreur est survenue, vos choix n'ont pas pu être enregistrés`} />)
        }).finally(() => {
            dispatch({ type: "FETCH_DONE" });
        })
    }
}

export const cancelPick = (pickId) => {
    return (dispatch, getState, { getFirebase, getFirestore, getAPIService }) => {
        dispatch({ type: "FETCH_START" });
        const api = getAPIService();
        const firebase = getFirebase();
        firebase.auth().currentUser.getIdToken().then(idToken => {
            return api.callAPIWithAuth(
                `picks/${pickId}`,
                idToken,
                {
                    method: 'PUT',
                }
            )
        }).then((response) => {
            dispatch({ type: "CANCEL_PICK" });
            toast(<NotificationToast appearance="success" message={`Vote annulé`} />)
        }).catch((err) => {
            console.error(err);
            dispatch({ type: "CANCEL_PICK_ERROR", err });
            toast(<NotificationToast appearance="error" message={`Une erreur est survenue, le vote n'a pas pu être annulé`} />)
        }).finally(() => {
            dispatch({ type: "FETCH_DONE" });
        })
    }
}

export const resolvePick = (pickId) => {
    return (dispatch, getState, { getFirebase, getFirestore, getAPIService }) => {
        dispatch({ type: "FETCH_START" });
        const api = getAPIService();
        const firebase = getFirebase();
        firebase.auth().currentUser.getIdToken().then(idToken => {
            return api.callAPIWithAuth(
                `picks/${pickId}`,
                idToken,
                {
                    method: 'POST',
                }
            )
        }).then((response) => {
            dispatch({ type: "RESOLVE_PICK" });
            toast(<NotificationToast appearance="success" message={`Vote terminé, voilà le résultat`} />)
        }).catch((err) => {
            console.error(err);
            dispatch({ type: "RESOLVE_PICK_ERROR", err });
            toast(<NotificationToast appearance="error" message={`Une erreur est survenue, le vote n'a pas pu se terminer`} />)
        }).finally(() => {
            dispatch({ type: "FETCH_DONE" });
        })
    }
}