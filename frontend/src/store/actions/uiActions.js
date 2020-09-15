
export const showSaveListModal = (show) => {
    return (dispatch) => {
        dispatch({ type: "SHOW_SAVELIST_MODAL", show });
    }
}

export const showJoinPickModal = (show) => {
    return (dispatch) => {
        dispatch({ type: "SHOW_JOINPICK_MODAL", show });
    }
}
