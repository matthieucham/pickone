import React from 'react';
import {
    Box
} from 'grommet';
import { useParams } from 'react-router-dom';
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

import PickDetails from "../picks/PickDetails";
import { updateChoices, cancelPick, resolvePick } from "../../store/actions/pickActions";


const OpenPick = ({ userId }) => {
    let params = useParams();
    return (
        <Box align="center" fill="horizontal">
            <WrappedPickDetailsWrapper pickId={params.id} userId={userId} />
        </Box>
    )
}

class PickDetailsWrapper extends React.Component {

    render() {
        const { userId, pickId, pick, vote, fetching, onSubmit, onCancel, onResolve } = this.props;
        return (
            <Box fill="horizontal">
                {pick &&
                    <PickDetails
                        userId={userId}
                        pickId={pickId}
                        pick={pick}
                        vote={vote}
                        disabled={fetching}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        onResolve={onResolve} />}
            </Box>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    // console.log(state);
    const picks = state.firestore.data.picks;
    const pick = picks ? picks[ownProps.pickId] : null;
    const myVote = state.firestore.data.myVote;
    return {
        pick: pick,
        vote: myVote,
        openPickError: state.pick.openPickError,
        fetching: state.ui.fetching
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onSubmit: (choices) => dispatch(updateChoices(ownProps.pickId, choices)),
        onResolve: () => dispatch(resolvePick(ownProps.pickId)),
        onCancel: () => dispatch(cancelPick(ownProps.pickId))
    }
}

const WrappedPickDetailsWrapper = compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((ownProps) => [
        {
            collection: "picks",
            doc: ownProps.pickId
        },
        {
            collection: "picks",
            doc: ownProps.pickId,
            subcollections: [
                {
                    collection: 'votes',
                    doc: ownProps.userId
                }
            ],
            storeAs: 'myVote'
        }
    ])
)(PickDetailsWrapper);

export default OpenPick;
