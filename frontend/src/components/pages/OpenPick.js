import React, { Component, useState } from 'react';
import dayjs from 'dayjs';
import {
    Box, Button, CheckBoxGroup, Form, FormField, Heading, List, RadioButtonGroup, Text, TextInput
} from 'grommet';
import { Group, Risk } from 'grommet-icons';
import { withRouter } from 'react-router-dom';

import { withAPIService, withFirebaseService } from '../../hoc';
import NotificationLayer from "../ext/NotificationLayer";
import RemovableItemBox from "../lib/RemovableItemBox";


class OpenPick extends Component {

    state = {
        pickId: this.props.match.params.id,
        isError: false,
        errorMessage: '',
        loading: true,
        pick: {},
        vote: [],
        pickedInList: [],
        suggested: "",
        // voters: [],
        // openNotif: false,
        // newVoterName: ""
    }

    componentDidMount() {
        this.props.FirebaseService.getDb().collection('picks/' + this.state.pickId + '/votes/').doc(this.props.user.id).get().then(vote => {
            if (vote.exists) {
                const voteData = vote.data();
                this.setState({ vote: voteData });
            }
        });
        this.props.FirebaseService.getDb().collection('picks').doc(this.state.pickId).onSnapshot(pick => {
            if (pick.exists) {
                const pickData = pick.data();
                this.setState({
                    loading: false,
                    pick: pickData,
                    pickedInList: this.state.vote.choices ? this.state.vote.choices.filter(v => pickData.choices.includes(v)) : [],
                    suggested: this.state.vote.choices ? this.state.vote.choices.filter(v => !pickData.choices.includes(v)).shift() : "",
                    isOrga: pickData.author.id === this.props.user.id
                });
            } else {
                this.setState({ loading: false, isError: true, errorMessage: "Impossible d'accèder à ce pick" })
            }
        });
    }

    cancelVote = async (vote) => {
        this.setState({
            isError: false,
            errorMessage: '',
            loading: true,
        });

        const user = this.props.user;
        try {
            const response = await this.props.APIService.callAPIWithAuth(
                `picks/${this.state.pickId}/vote/${vote.id}`,
                user.idToken,
                {
                    method: 'DELETE',
                    body: JSON.stringify({ displayName: vote.name }),
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
        const { pick, pickedInList, suggested, loading, isOrga } = this.state;
        return (
            <Box align="center">
                {(!loading) && (
                    <Box align="center">
                        <Heading level="3">Voter pour "{pick.title}"</Heading>
                        <Text>Organisé par {pick.author.name} le {dayjs(pick.dateCreated).format('DD/MM/YYYY')}</Text>
                        <Text>Clé: {pick.key}</Text>
                        <Box direction="row" justify="start" alignContent="start" wrap>
                            {pick.voters.map((it) =>
                                <RemovableItemBox key={"vb_" + it.id}
                                    label={it.name}
                                    confirmText={isOrga ? `Annuler le vote de ${it.name} ?` : undefined}
                                    onRemove={() => this.cancelVote(it)} />)}
                        </Box>
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
                {/* {this.state.openNotif &&
                    <NotificationLayer text={`${this.state.newVoterName} a voté`} status="ok" onClose={() => this.setState({ openNotif: false })} />
                } */}
            </Box>

        );
    }
}

const WrappedComponent = withRouter(withFirebaseService(withAPIService(OpenPick)));
export default WrappedComponent;
