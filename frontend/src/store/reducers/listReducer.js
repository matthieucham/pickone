const initState = {}

const listReducer = (state = initState, action) => {
    switch (action.type) {
        case "DELETE_LIST":
            return state;
        case "DELETE_LIST_ERROR":
            return state;
        case "CREATE_LIST":
            return state;
        case "CREATE_LIST_ERROR":
            return {
                ...state,
                listError: action.err.message
            };
        case "EDIT_LIST":
            return state;
        case "EDIT_LIST_ERROR":
            return {
                ...state,
                listError: action.err.message
            };
        default:
            return state;
    }
}

export default listReducer;