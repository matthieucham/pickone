const initState = {
    picks: [
    ],
    registrations: [
        {
            pickId: "AZERTYUIO",
            pickTitle: "Static pick",
            status: "",
            pickDate: { seconds: 1234567 },
            pickAuthor: { id: "WXCVBN", name: "M. Static" }
        }
    ],
    joinedPickId: null
}

const pickReducer = (state = initState, action) => {
    switch (action.type) {
        case "CREATE_PICK":
            return {
                ...state,
                pickError: null
            };
        case "CREATE_PICK_ERROR":
            return {
                ...state,
                pickError: action.err.message
            };
        case "JOIN_PICK":
            return {
                ...state,
                joinError: null
            };
        case "JOIN_PICK_ERROR":
            return {
                ...state,
                joinError: action.err.message
            };
        case "CANCEL_VOTE":
            return {
                ...state,
                cancelVoteError: null
            };
        case "CANCEL_VOTE_ERROR":
            return {
                ...state,
                cancelVoteError: action.err.message
            };
        case "UPDATE_CHOICES":
        case "CANCEL_PICK":
        case "RESOLVE_PICK":
            return {
                ...state,
                openPickError: null
            };
        case "UPDATE_CHOICES_ERROR":
        case "CANCEL_PICK_ERROR":
        case "RESOLVE_PICK_ERROR":
            return {
                ...state,
                openPickError: action.err.message
            };

        default:
            return state;
    }
}


export default pickReducer;