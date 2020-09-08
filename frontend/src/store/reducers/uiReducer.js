const initState = {
    fetching: false
}

const uiReducer = (state = initState, action) => {
    switch (action.type) {
        case "FETCH_START":
            return {
                ...state,
                fetching: true
            }
        case "FETCH_DONE":
            return {
                ...state,
                fetching: false
            }
        default:
            return state;
    }
}

export default uiReducer;