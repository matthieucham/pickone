import React, { Component } from 'react';
import {
    Box, Heading
} from 'grommet';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

import { createPick } from "../../store/actions/pickActions";
import { showSaveListModal } from "../../store/actions/uiActions";
import SaveListLayer from "../picks/SaveListLayer";
import CreatePickForm from "../picks/CreatePickForm";

class NewPick extends Component {

    state = {
        currentChoices: []
    }

    handleSubmit = (values) => {
        this.props.createPick(values, this.props.history);
    }

    render() {
        const { currentChoices } = this.state;
        const { lists, showSaveList, showSaveListModal, fetching, error } = this.props;
        return (
            <Box align="center" pad="small">
                <Heading level="3">Organiser un vote</Heading>
                <Box align="center" justify="center">
                    <Box width="large">
                        <CreatePickForm
                            lists={lists}
                            onSaveList={
                                (ch) => {
                                    showSaveListModal(true);
                                    this.setState({ currentChoices: ch });
                                }
                            }
                            fetching={fetching}
                            error={error}
                            onSubmit={this.handleSubmit}
                        />
                    </Box>
                </Box>
                {
                    showSaveList &&
                    <SaveListLayer
                        choices={currentChoices}
                        onCancelAction={() => showSaveListModal(false)} />
                }
            </Box>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lists: state.firestore.ordered.myLists,
        showSaveList: state.ui.showSaveList,
        fetching: state.ui.fetching,
        error: state.pick.pickError
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        showSaveListModal: (show) => dispatch(showSaveListModal(show)),
        createPick: (pick, history) => dispatch(createPick(pick, history))
    }
}

export default compose(
    firestoreConnect((props) => {
        return [
            {
                collection: 'users',
                doc: props.userId,
                subcollections: [
                    {
                        collection: 'lists',
                        orderBy: ['dateUpdated', 'desc']
                    }
                ],
                storeAs: 'myLists'
            }
        ]
    }),
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(NewPick);