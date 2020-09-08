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
    ]
}

const pickReducer = (state = initState, action) => {
    switch (action.type) {
        case "CREATE_PICK":
            console.log("created pick", action.pick);
            return state;
        case "CREATE_PICK_ERROR":
            console.log("create pick error", action.err);
            return state;
        default:
            return state;
    }
}

export default pickReducer;