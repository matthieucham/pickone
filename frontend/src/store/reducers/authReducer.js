const initState = {}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case "LOGIN_ERROR":
            return {
                ...state,
                authError: action.err.message
            }
        case "LOGIN_SUCCESS":
            return {
                ...state,
                anonymousDisplayName: null,
                authError: null
            }
        case "SIGNOUT_SUCCESS":
            return {
                ...state,
                anonymousDisplayName: null,
                authError: null
            }
        case "LOGIN_ANONYMOUS":
            return {
                ...state,
                anonymousDisplayName: action.displayName
            }
        case "CREATE_ACCOUNT_SUCCESS":
            return {
                ...state,
                anonymousDisplayName: action.displayName,
                authError: null
            }
        case "CREATE_ACCOUNT_ERROR":
            return {
                ...state,
                authError: action.err.message
            }
        case "REGISTER_ANONYMOUS_SUCCESS":
            return {
                ...state,
                authError: null
            }
        case "REGISTER_ANONYMOUS_ERROR":
            return {
                ...state,
                authError: action.err.message
            }
        default:
            return state;
    }
}

export default authReducer;