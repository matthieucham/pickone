const initState = {
    fetching: false,
    showSaveList: false,
    showJoinPick: false
}

const uiReducer = (state = initState, action) => {
    switch (action.type) {
        case "FETCH_START":
            return {
                ...state,
                fetching: true
            };
        case "FETCH_DONE":
            return {
                ...state,
                fetching: false
            };
        case "SHOW_SAVELIST_MODAL":
            return {
                ...state,
                showSaveList: action.show
            };
        case "SHOW_JOINPICK_MODAL":
            return {
                ...state,
                showJoinPick: action.show
            };
        case "DISABLE_PUSH_MESSAGING":
            return {
                ...state,
                pushMessaging: false
            }
        case "PUSH_MESSAGING":
            return {
                ...state,
                pushMessaging: true
            }
        default:
            return state;
    }
}

export default uiReducer;