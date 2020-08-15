import React, { Component } from 'react';
import dayjs from 'dayjs';
import {
    Box, Button, CheckBoxGroup, Form, FormField, Heading, Menu, RadioButtonGroup, Text, TextInput
} from 'grommet';
import { Trash } from 'grommet-icons';
import { withRouter } from 'react-router-dom';

import { withAPIService, withFirebaseService, withToast } from '../../hoc';
import PickStatusBar from "../lib/PickStatusBar";
import LabelAndValue from "../lib/LabelAndValue";
import ConfirmationLayer from "../lib/ConfirmationLayer";
import LoadingLayer from "../lib/LoadingLayer";


const VotersBox = ({ userId, voters, onCancel, ...props }) => {
    const [openConfirm, setOpenConfirm] = React.useState();
    const [clickedVoter, setClickedVoter] = React.useState();
    const onCloseConfirm = () => setOpenConfirm(undefined);
    const onConfirmAndClose = () => {
        setOpenConfirm(undefined);
        onCancel(clickedVoter);
    }
    let summaryLabel;
    if (voters && voters.length > 1) {
        summaryLabel = `${voters.length} votants`;
    } else if (voters && voters.length === 1) {
        summaryLabel = `${voters.length} votant`;
    } else {
        summaryLabel = `Aucun votant`;
    }
    const hasVoters = (voters && voters.length > 0);
    let votersItems = [];
    if (hasVoters) {
        votersItems = voters.map(v => {
            return {
                label: <Box pad="small" alignSelf="center">{v.name}</Box>,
                icon: (onCancel && userId !== v.id) ? <Box alignSelf="center"><Trash /></Box> : undefined,
                gap: "small",
                reverse: true,
                onClick: (onCancel && userId !== v.id) ? () => { setClickedVoter(v); setOpenConfirm(true) } : undefined
            }
        });
    }
    return <Box border round="xsmall" {...props} align="center" justify="center">
        <Menu dropProps={{
            align: { top: 'bottom', left: 'left' },
            elevation: 'medium',
            round: "small"
        }}
            label={<Text weight="bold">{summaryLabel}</Text>}
            items={votersItems}
            disabled={votersItems.length == 0}
            focusIndicator={false} />
        {openConfirm && (
            <ConfirmationLayer onCancelAction={onCloseConfirm} onConfirmAction={onConfirmAndClose}
                title="Confirmation" text={`Supprimer le vote de ${clickedVoter.name} ?`} actionLabel="Supprimer" />
        )}
    </Box>
}


// class OpenPickForm extends Component {

//     render() {

//     }
// }


class OpenPick extends Component {

    state = {
        pickId: this.props.match.params.id,
        isError: false,
        errorMessage: '',
        loading: true,
        pickFound: false,
        pick: {},
        vote: [],
        pickedInList: [],
        suggested: "",
        openToast: false
    }

    componentDidMount() {
        this.props.FirebaseService.getDb().collection('picks/' + this.state.pickId + '/votes/').doc(this.props.user.id).get().then(vote => {
            if (vote.exists) {
                const voteData = vote.data();
                this.setState({ vote: voteData });
            } else {
                this.setState({ vote: [] });
            }
        });
        this.props.FirebaseService.getDb().collection('picks').doc(this.state.pickId).onSnapshot(pick => {
            if (pick.exists) {
                const pickData = pick.data();
                this.setState({
                    loading: false,
                    pickFound: true,
                    pick: pickData,
                    pickedInList: this.state.vote.choices ? this.state.vote.choices.filter(v => pickData.choices.includes(v)) : [],
                    suggested: this.state.vote.choices ? this.state.vote.choices.filter(v => !pickData.choices.includes(v)).shift() : "",
                    isOrga: pickData.author.id === this.props.user.id
                });
            } else {
                this.setState({ loading: false, isError: true, errorMessage: "404" })
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
                this.props.addToast(`Un problème est survenu lors de la suppression du vote de ${vote.name}`, { appearance: "error" })
            } else {
                this.setState({ loading: false, isError: false });
                this.props.addToast(`Vote de ${vote.name} supprimé`, { appearance: "success" })
            }
        } catch (e) {
            this.setState({ loading: false, isError: true, errorMessage: e.message });
            this.props.addToast(`Un problème est survenu lors de la suppression du vote de ${vote.name}`, { appearance: "error" })
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
                    method: 'PUT',
                    body: JSON.stringify({ picked: values }),
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            ).then(response => response.json());
            if ("error" in response) {
                this.setState({ loading: false, isError: true, errorMessage: response.error });
                this.props.addToast("Erreur lors de l'enregistrement du vote", { appearance: "error" })
            } else {
                this.setState({
                    loading: false,
                    isError: false,
                });
                this.props.addToast("Vote enregistré", { appearance: "success" })
            }
        } catch (e) {
            this.setState({ loading: false, isError: true, errorMessage: e.message });
            this.props.addToast("Erreur lors de l'enregistrement du vote", { appearance: "error" })
        }
    }

    cancel = async () => {
        this.setState({
            isError: false,
            errorMessage: '',
            loading: true,
        });

        const user = this.props.user;
        try {
            const response = await this.props.APIService.callAPIWithAuth(
                `picks/${this.state.pickId}`,
                user.idToken,
                {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            ).then(response => response.json());
            if ("error" in response) {
                this.setState({ loading: false, isError: true, errorMessage: response.error });
                this.props.addToast("Erreur lors de l'annulation du vote", { appearance: "error" })
            } else {
                this.setState({ loading: false, isError: false });
                this.props.addToast(`Vote ${this.state.pick.title} annulé`, { appearance: "success" })
            }
        } catch (e) {
            this.setState({ loading: false, isError: true, errorMessage: e.message });
            this.props.addToast("Erreur lors de l'annulation du vote", { appearance: "error" })
        }
    }

    terminate = async () => {
        this.setState({
            isError: false,
            errorMessage: '',
            loading: true,
        });

        const user = this.props.user;
        try {
            const response = await this.props.APIService.callAPIWithAuth(
                `picks/${this.state.pickId}`,
                user.idToken,
                {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            ).then(response => response.json());
            if ("error" in response) {
                this.setState({ loading: false, isError: true, errorMessage: response.error });
                this.props.addToast("Erreur lors de la clôture du vote", { appearance: "error" })
            } else {
                this.setState({ loading: false, isError: false });
                this.props.addToast(`Vote ${this.state.pick.title} terminé`, { appearance: "success" })
            }
        } catch (e) {
            this.setState({ loading: false, isError: true, errorMessage: e.message });
            this.props.addToast("Erreur lors de la clôture du vote", { appearance: "error" })
        }
    }

    render() {
        const { pick, pickFound, pickedInList, suggested, loading, isOrga } = this.state;
        return (
            <Box align="center" fill="horizontal">
                {pickFound && (
                    <Box align="center" fill="horizontal">
                        <Heading level="4">{pick.title}</Heading>
                        <Box pad="medium" direction="row" wrap>
                            <LabelAndValue label="Date" value={dayjs(pick.dateCreated).format('DD/MM/YYYY')} margin="xsmall" />
                            <LabelAndValue label="Organisateur" value={pick.author.name} margin="xsmall" />
                            <LabelAndValue label="Mode d'élection" value={pick.mode === "random" ? "Au hasard" : "A la majorité"} margin="xsmall" />
                            <VotersBox userId={this.props.user.id} voters={pick.voters} onCancel={isOrga ? this.cancelVote : undefined} margin="xsmall" />
                        </Box>

                        <PickStatusBar pick={pick}
                            onClosePick={isOrga ? this.terminate : undefined}
                            onCancelPick={isOrga ? this.cancel : undefined} />
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
                {
                    loading && <LoadingLayer />
                }
            </Box>

        );
    }
}

const WrappedComponent = withRouter(withFirebaseService(withAPIService(withToast(OpenPick))));
export default WrappedComponent;
