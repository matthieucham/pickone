import React, { Component } from 'react';
import dayjs from 'dayjs';
import {
    Box, Button, CheckBoxGroup, Distribution, Form, FormField, Heading, Menu, RadioButtonGroup, Text, TextInput
} from 'grommet';
import { Clear, InProgress, Scorecard, Trash } from 'grommet-icons';
import { withRouter } from 'react-router-dom';

import { withAPIService, withFirebaseService, withToast } from '../../hoc';
import PickControlPanel from "../lib/PickControlPanel";
import LabelAndValue from "../lib/LabelAndValue";
import PickCodeDisplay from "../lib/PickCodeDisplay";
import ConfirmationLayer from "../lib/ConfirmationLayer";
import LoadingLayer from "../lib/LoadingLayer";


const VotersBox = ({ userId, voters, hideAction, onCancel, ...props }) => {
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
                icon: (!hideAction && onCancel && userId !== v.id) ? <Box alignSelf="center"><Trash /></Box> : undefined,
                gap: "small",
                reverse: true,
                onClick: (!hideAction && onCancel && userId !== v.id) ? () => { setClickedVoter(v); setOpenConfirm(true) } : undefined
            }
        });
    }
    return <Box align="center" justify="center" background="light-2" {...props} >
        <Menu dropProps={{
            align: { top: 'bottom', left: 'left' },
            elevation: 'medium',
            round: "small"
        }}
            label={<Text weight="bold">{summaryLabel}</Text>}
            items={votersItems}
            disabled={votersItems.length === 0}
            focusIndicator={false} />
        {openConfirm && (
            <ConfirmationLayer onCancelAction={onCloseConfirm} onConfirmAction={onConfirmAndClose}
                title="Confirmation" text={`Supprimer le vote de ${clickedVoter.name} ?`} actionLabel="Supprimer" />
        )}
    </Box>
}


const OpenPickForm = ({ choices, values, suggest, multiple, onSubmit }) => {
    const [pickedList, setPickedList] = React.useState(values ? values.filter(v => choices.includes(v)) : []);
    const [suggested, setSuggested] = React.useState(values ? values.filter(v => !choices.includes(v)).shift() : "");
    return (
        <Box pad="small" align="center" border="all" round="xsmall">
            <Form onSubmit={onSubmit} align="center">
                <FormField label="Je vote pour :" name="picked" required>
                    {(multiple) ?
                        (<CheckBoxGroup name="picked" options={choices} value={pickedList}
                            onChange={({ value: nextValue }) => setPickedList(nextValue)} />)
                        :
                        (<RadioButtonGroup name="picked" options={choices} value={pickedList ? pickedList[0] : undefined}
                            onChange={(event) => { setPickedList([event.target.value]) }} />)
                    }
                </FormField>
                {
                    suggest && multiple &&
                    <FormField label="Une autre suggestion ?" name="suggested">
                        <TextInput name="suggested" size="large" value={suggested} onChange={event => setSuggested(event.target.value)} />
                    </FormField>
                }

                <Button type="submit" label="Voter" primary />
            </Form>
        </Box>)
}

const ResultPanel = ({ winner, scores }) => {
    let totalVotes = Object.entries(scores).reduce((total, sc) => total + sc[1], 0);

    const distrival = Object.entries(scores).map(
        ([choice, score]) => (
            {
                value: score,
                color: (choice === winner ? 'brand' : 'light-3'),
                label: choice,
                pct: (Math.round(score * 100.0 / totalVotes) / 100) * 100
            }
        ));

    return <Box justify="center" align="center">
        <Box width="medium" align="center">
            <Text>Victoire de ...</Text>
            <Box animation={{
                type: "fadeIn",
                delay: 0,
                duration: 5000
            }}>
                <Heading level="3">{winner}</Heading>
            </Box>
        </Box>
        <Box width="large" align="center"
            animation={{
                type: "fadeIn",
                delay: 0,
                duration: 5000
            }}>
            <Distribution values={distrival} fill basis="full">
                {value => (
                    <Box pad="medium" align="center" background={value.color} fill>
                        <Text size="small">{value.label}</Text>
                        <Text weight="bold" size="large">{value.pct} %</Text>
                        <Text size="small">{value.value} voix</Text>
                    </Box>
                )}
            </Distribution>
        </Box>
    </Box>
}

class OpenPick extends Component {

    state = {
        pickId: this.props.match.params.id,
        isError: false,
        errorMessage: '',
        loading: true,
        pickFound: false,
        pick: {},
        vote: [],
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

    onChoicesSubmitted = async ({ value }) => {
        await this.setState({
            isError: false,
            errorMessage: '',
            loading: true,
        });

        let values;
        if (this.state.pick.suggest === true && value.suggested) {
            Array.isArray(value.picked) ?
                values = [...value.picked, value.suggested] :
                values = [value.picked, value.suggested];
        } else {
            Array.isArray(value.picked) ?
                values = [...value.picked] :
                values = [value.picked];
        }

        const user = this.props.user;
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
            console.log(e);
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
        const { pick, pickFound, vote, loading, isOrga } = this.state;
        const status = {
            color: pick.cancelled ? "status-warning" : (
                pick.result ? "brand" : "status-ok"),
            icon: pick.cancelled ? <Clear size="small" /> : (
                pick.result ? <Scorecard size="small" /> : <InProgress size="small" />),
            label: pick.cancelled ? "Annulé" : (
                pick.result ? "Terminé" : "En cours"
            )
        }
        return (
            <Box align="center" fill="horizontal">
                {pickFound && (
                    <Box align="center" fill="horizontal">
                        <Heading level="4">{pick.title}</Heading>
                        <Box pad="small"><Text>{pick.description}</Text></Box>
                        {!pick.cancelled && !pick.result &&
                            <Box direction="row-responsive" justify="between" gap="medium">
                                <Box justify="center" align="center">
                                    <PickCodeDisplay code={pick.key} border round="xsmall" background="dark-2" />
                                </Box>

                                {
                                    isOrga &&
                                    <PickControlPanel
                                        border round="xsmall" elevation="small"
                                        pick={pick}
                                        onClosePick={this.terminate}
                                        onCancelPick={this.cancel} />
                                }
                            </Box>
                        }
                        <Box pad="small" direction="row" wrap>
                            <LabelAndValue label="Statut" value={status.label} background={status.color} icon={status.icon} border round="xsmall" margin="small" />
                            <LabelAndValue label="Date" value={dayjs.unix(pick.dateCreated.seconds).format('DD/MM/YYYY')} border round="xsmall" margin="small" />
                            <LabelAndValue label="Organisateur" value={pick.author.name} border round="xsmall" margin="small" />
                            <LabelAndValue label="Mode d'élection" value={pick.mode === "random" ? "Au hasard" : "A la majorité"} border round="xsmall" margin="small" />
                            <VotersBox userId={this.props.user.id}
                                voters={pick.voters}
                                onCancel={isOrga ? this.cancelVote : undefined}
                                hideAction={pick.result || pick.cancelled}
                                border round="xsmall"
                                margin="small" />
                        </Box>

                        {
                            !pick.result && !pick.cancelled &&
                            <OpenPickForm choices={pick.choices} values={vote.choices || []} suggest={pick.suggest} multiple={pick.multiple} onSubmit={this.onChoicesSubmitted} />
                        }
                        {
                            pick.cancelled &&
                            <Box justify="center">
                                <Text weight="bold">Vote annulé par l'organisateur</Text>
                                <Text size="small">Parce que la démocratie, c'est très surfait</Text>
                            </Box>
                        }
                        {
                            pick.result && !pick.cancelled &&
                            <ResultPanel winner={pick.result.winner} scores={pick.result.scores} />
                        }

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
