import React, { Component, useState } from 'react';
import dayjs from 'dayjs';
import {
    Box, Button, CheckBoxGroup, Collapsible, Form, FormField, Heading, Layer, RadioButtonGroup, ResponsiveContext, Text, TextInput
} from 'grommet';
import { Group, Risk, Expand, FormClose } from 'grommet-icons';
import { withRouter } from 'react-router-dom';

import { withAPIService, withFirebaseService } from '../../hoc';
import NotificationLayer from "../ext/NotificationLayer";
import RemovableItemBox from "../lib/RemovableItemBox";
import PickStatusBar from "../lib/PickStatusBar";
import LabelAndValue from "../lib/LabelAndValue";


const VotersBox = (props) => {
    const [openDetails, setOpenDetails] = React.useState(false);
    const { voters, onCancel } = props;
    let summaryLabel;
    if (props.voters && voters.length > 1) {
        summaryLabel = `${voters.length} votants`;
    } else if (voters && voters.length === 1) {
        summaryLabel = `${voters.length} votant`;
    } else {
        summaryLabel = `Aucun votant pour l'instant`;
    }
    const hasVoters = (voters && voters.length > 0);
    return <ResponsiveContext.Consumer>
        {size => (
            <Box border>
                <Box
                    align="center"
                    direction="row"
                    gap="small"
                    pad="small"
                    margin="small"
                    justify="between"
                >
                    <Text>{summaryLabel}</Text>
                    {hasVoters &&
                        <Button icon={<Expand />}
                            onClick={() => setOpenDetails(!openDetails)}
                            focusIndicator={false}
                            hoverIndicator={true}
                            pad="xsmall"
                            plain />
                    }
                </Box>
                {(!openDetails || size !== 'small') ? (
                    <Collapsible direction="vertical" open={openDetails}>
                        <Box
                            flex
                            width='medium'
                            elevation='small'
                            alignContent='start'
                            direction="row"
                            justify='start'
                            wrap
                        >
                            {
                                hasVoters && voters.map((it) =>
                                    <RemovableItemBox key={"vb_" + it.id}
                                        label={it.name}
                                        confirmText={onCancel ? `Annuler le vote de ${it.name} ?` : undefined}
                                        onRemove={onCancel ? () => onCancel(it) : undefined} />)
                            }
                        </Box>
                    </Collapsible>
                ) : (
                        <Layer responsive={false}
                            onClickOutside={() => setOpenDetails(false)}
                            onEsc={() => setOpenDetails(false)}>
                            <Box pad="medium" gap="small" width="medium">
                                <Box
                                    tag='header'
                                    justify='between'
                                    align='center'
                                    direction='row'
                                >
                                    <Text>{summaryLabel}</Text>
                                    <Button
                                        icon={<FormClose />}
                                        onClick={() => setOpenDetails(false)}
                                        focusIndicator={false}
                                        hoverIndicator={true}
                                    />
                                </Box>
                                <Box
                                    alignContent='start'
                                    direction="row"
                                    justify='start'
                                    wrap
                                >
                                    {
                                        hasVoters && voters.map((it) =>
                                            <RemovableItemBox key={"vb_" + it.id}
                                                label={it.name}
                                                confirmText={onCancel ? `Annuler le vote de ${it.name} ?` : undefined}
                                                onRemove={onCancel ? () => onCancel(it) : undefined} />)
                                    }
                                </Box>
                            </Box>
                        </Layer>
                    )}
            </Box>)}
    </ResponsiveContext.Consumer>
}


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
        // openNotif: false,
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
            <Box align="center" fill>
                {(!loading) && (
                    <Box align="center" fill border>
                        <Heading level="4">{pick.title}</Heading>
                        <LabelAndValue label="Organisateur" value={pick.author.name} />
                        <PickStatusBar pick={pick} onClosePick={() => { }} onCancelPick={() => { }} />
                        <VotersBox voters={pick.voters} onCancel={isOrga ? this.cancelVote : undefined} />
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
