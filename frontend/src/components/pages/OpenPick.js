import React, { Component, useState } from 'react';
import dayjs from 'dayjs';
import {
    Box, Button, CheckBoxGroup, Form, FormField, Heading, List, RadioButtonGroup, Text, TextInput
} from 'grommet';
import { Group, Risk } from 'grommet-icons';
import { withRouter } from 'react-router-dom';

import { withAPIService, withFirebaseService } from '../../hoc';
import NotificationLayer from "../ext/NotificationLayer";


class OpenPick extends Component {

    state = {
        pickId: this.props.match.params.id,
        isError: false,
        errorMessage: '',
        loading: true,
        pick: {},
        pickedInList: [],
        suggested: "",
        voters: [],
        openNotif: false,
        newVoterName: ""
    }

    componentDidMount() {
        this.props.FirebaseService.getDb().collection('picks').doc(this.state.pickId).get().then((pick) => {
            if (pick.exists) {
                const pickData = pick.data();
                this.setState({ pick: pickData });
                this.props.FirebaseService.getDb().collection('picks/' + this.state.pickId + '/votes/').doc(this.props.user.id).get().then(vote => {
                    if (vote.exists) {
                        const voteData = vote.data();
                        this.setState({
                            pickedInList: voteData.choices.filter(v => pickData.choices.includes(v)),
                            suggested: voteData.choices.filter(v => !pickData.choices.includes(v)).shift()
                        });
                    }
                    this.setState({ loading: false });
                });
                this.props.FirebaseService.getDb().collection('picks/' + this.state.pickId + '/votes/').onSnapshot(snapshot => {
                    let voters = [];
                    snapshot.forEach(doc => {
                        voters.push({ name: doc.data().name, id: doc.id });
                    });
                    this.setState({ voters: voters });
                    snapshot.docChanges().forEach(change => {
                        if (change.type === "added" || change.type === "modified") {
                            console.log(change.doc.data());
                            this.setState({ newVoterName: change.doc.data().name, openNotif: true });
                        }
                    });
                });
            } else {
                this.setState({ loading: false, isError: true, errorMessage: "Impossible d'accèder à ce pick" })
            }
        }
        ).catch((error) => {
            this.setState({ loading: false, isError: true, errorMessage: "Impossible d'accèder à ce pick" })
        });
    }

    handleSubmit = async ({ value }) => {


        await this.setState({
            isError: false,
            errorMessage: '',
            loading: true,
        });

        let values;
        if (this.state.pick.suggest === true && value.suggested) {
            values = [...value.picked, value.suggested];
        } else {
            values = [...value.picked];
        }

        const user = this.props.user;
        let responseJSON = { error: "" };
        try {
            const response = await this.props.APIService.callAPIWithAuth(
                `picks/${this.state.pickId}/vote`,
                user.idToken,
                {
                    method: 'POST',
                    body: JSON.stringify({ picked: values }),
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            ).then(response => response.json());
            if ("error" in response) {
                this.setState({ loading: false, isError: true, errorMessage: response.error });
            } else {
                this.setState({ loading: false, isError: false });
            }
        } catch (e) {
            this.setState({ loading: false, isError: true, errorMessage: e.message });
        }
    }

    render() {
        const { pick, pickedInList, suggested, loading, voters } = this.state;
        return (
            <Box align="center">
                {(!loading) && (
                    <Box align="center">
                        <Heading level="3">Voter pour "{pick.title}"</Heading>
                        <Text>Organisé par {pick.author.name} le {dayjs(pick.dateCreated).format('DD/MM/YYYY')}</Text>
                        <Text>Clé: {pick.key}</Text>
                        <List data={voters} primaryKey="name" />
                        <Form pad="small" align="center" onSubmit={this.handleSubmit}>
                            <FormField label="Choix" name="picked" required>

                                {(true) ?
                                    (<CheckBoxGroup name="picked" options={pick.choices} value={pickedInList}
                                        onChange={({ value: nextValue }) => this.setState({ pickedInList: nextValue })} />)
                                    :
                                    (<RadioButtonGroup name="picked" options={pick.choices} value={pickedInList}
                                        onChange={({ value: nextValue }) => this.setState({ pickedInList: nextValue })} />)
                                }
                            </FormField>
                            {
                                pick.suggest &&
                                <FormField label="Une autre suggestion ?" name="suggested">
                                    <TextInput name="suggested" size="large" value={suggested} onChange={event => this.setState({ suggested: event.target.value })} />
                                </FormField>
                            }

                            <Button type="submit" label="Voter" disabled={loading} primary />

                        </Form>
                    </Box>
                )}
                {this.state.openNotif &&
                    <NotificationLayer text={`${this.state.newVoterName} a voté`} status="ok" onClose={() => this.setState({ openNotif: false })} />
                }
            </Box>

        );
    }
}

const WrappedComponent = withRouter(withFirebaseService(withAPIService(OpenPick)));
export default WrappedComponent;
