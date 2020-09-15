import React from 'react';
import {
    Box, Button, Form, FormField, Text, TextInput
} from 'grommet';
import { withRouter } from 'react-router-dom';

import ItemsField from '../fields/ItemsField';

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { createList, editList } from "../../store/actions/listActions";

class ThinForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choices: props.choices || [],
            name: props.name || ""
        }
    }

    handleSubmit = () => {
        this.props.onSubmit(this.state);
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormField label="Nom de la liste" name="name" required>
                    <TextInput name="name"
                        type="text"
                        value={this.state.name}
                        onChange={(e) => { this.setState({ name: e.target.value }) }} />
                </FormField>

                <FormField label="Choix"
                    name="choices"
                    error={this.state.choices.length === 0 ? "Ce champ est requis" : ""}>
                    <ItemsField value={this.state.choices}
                        onChange={(val) => { this.setState({ choices: val }) }} />
                </FormField>


                {this.props.error && (
                    <Box pad={{ horizontal: 'small' }}>
                        <Text color="status-error">{this.props.error}</Text>
                    </Box>
                )}

                <Box direction="row" justify="center" margin={{ top: 'medium' }}>
                    <Button type="submit" label="Enregistrer" disabled={this.props.fetching} primary />
                </Box>
            </Form>
        )
    };
}

class ChoicesListEditForm extends React.Component {

    render() {
        const { listId, list, listError, fetching, createList, editList, history, ...props } = this.props;
        const showForm = Boolean(!listId || list);
        console.log(showForm);
        return (
            <Box {...props}>
                {showForm &&
                    <ThinForm error={listError}
                        fetching={fetching}
                        onSubmit={({ name, choices }) => {
                            if (list) {
                                // edit mode
                                editList({ name, choices }, listId, history);
                            } else {
                                // create mode
                                createList({ name, choices }, history);
                            }
                        }}
                        name={list ? list.name : ""}
                        choices={list ? list.choices : []} />}
            </Box>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        list: state.firestore.data.myLists && ownProps.listId ? state.firestore.data.myLists[ownProps.listId] : null,
        listError: state.list.listError,
        fetching: state.ui.fetching
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        createList: (data, history) => dispatch(createList(data, history)),
        editList: (data, listId, history) => dispatch(editList(data, listId, history))
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
)(ChoicesListEditForm);