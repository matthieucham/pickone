import React, { Component } from "react";
import { Box, Button, Heading } from "grommet";
import { AddCircle } from "grommet-icons";
import { RouterButton } from "../ext/RoutedControls";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { deleteList } from "../../store/actions/listActions";
import { ChoicesListsAccordion } from "../lists/ChoicesListsAccordion";
import { cleanupDb } from "../../store/actions/supportActions";

class ChoicesLists extends Component {

    render() {
        const { lists, deleteList } = this.props;
        return (
            <Box align="center" pad="small">
                {/* <Button label="TEST CLEANUP" onClick={this.props.cleanupDb} /> */}
                <Heading level="3">Listes de choix prédéfinis</Heading>
                <Box width="large" align="center">
                    <RouterButton path="/newlist" label="Nouvelle liste" icon={<AddCircle />} />
                    <ChoicesListsAccordion lists={lists} onDelete={deleteList} />
                </Box>
            </Box>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        lists: state.firestore.ordered.myLists
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        deleteList: (list) => dispatch(deleteList(list)),
        cleanupDb: () => dispatch(cleanupDb())
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
    connect(mapStateToProps, mapDispatchToProps)
)(ChoicesLists);