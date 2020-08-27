import React, { Component } from 'react';
import {
    Box, Button, CheckBox, Form, FormField, Heading, Menu, RadioButtonGroup, Text, TextArea, TextInput
} from 'grommet';
import { Group, NewWindow, Risk } from 'grommet-icons';
import { withRouter } from 'react-router-dom';

import { withAPIService, withFirebaseService } from '../../hoc';
import ItemsField from '../fields/ItemsField';
import LoadingLayer from "../lib/LoadingLayer";



class NewPick extends Component {

    state = {
        isError: false,
        errorMessage: '',
        loading: false,
        showFieldSuggest: false,
        choices: [],
        choicesLists: undefined,
        itemsFieldKey: "empty",
    }

    componentDidMount() {
        const user = this.props.user;
        this.props.FirebaseService.getDb().collection('users/' + user.id + '/lists/').orderBy('name').get().then(snapshot => {
            if (snapshot.empty) {
                this.setState({ choicesLists: undefined });
            } else {
                let lists = snapshot.docs.map(doc => doc.data());
                this.setState({ choicesLists: lists });
            }
        });
    }

    handleSubmit = async ({ value }) => {

        await this.setState({
            isError: false,
            errorMessage: '',
            loading: true
        });

        const user = this.props.user;
        try {
            const response = await this.props.APIService.callAPIWithAuth(
                'picks/',
                user.idToken,
                {
                    method: 'POST',
                    body: JSON.stringify({ ...value, choices: this.state.choices }),
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            ).then(response => response.json());
            if ("error" in response) {
                this.setState({ loading: false, isError: true, errorMessage: response.error });
            } else {
                this.setState({ loading: false });
                this.props.history.push(`/pick/${response.pickId}`);
            }
        } catch (e) {
            this.setState({ loading: false, isError: true, errorMessage: e.message });
        }
    }

    render() {
        const { isError, errorMessage, loading, showFieldSuggest, choices, choicesLists, itemsFieldKey } = this.state;
        return (
            <Box align="center">
                <Heading level="3">Organiser un vote</Heading>
                <Box align="center" justify="center">
                    <Box width="large">
                        <Form
                            onSubmit={this.handleSubmit}
                        >
                            <FormField label="Titre" name="title" required>
                                <TextInput name="title" type="text" placeholder="Titre" />
                            </FormField>

                            <FormField
                                label="Description"
                                name="description"
                                info={
                                    <Box>
                                        <Text size="small">Quel est le contexte du vote : pour qui, pour quoi faire...</Text>
                                    </Box>
                                }>
                                <TextArea placeholder="Description" name="description" />
                            </FormField>

                            <FormField
                                label="Mode de vote"
                                name="mode"
                                info={
                                    <Box>
                                        <Text size="small">Au hasard: le gagnant sera tiré au sort parmi les choix des votants</Text>
                                        <Text size="small">A la majorité: le gagnant sera le choix ayant obtenu le plus de voix</Text>
                                    </Box>
                                }
                                required>
                                <RadioButtonGroup
                                    name="mode"
                                    options={['random', 'majority']}
                                    direction="row"
                                    onChange={event => this.setState({ showFieldSuggest: event.target.value === 'random' })}
                                >
                                    {(option, { checked, hover }) => {
                                        const Icon = option === 'random' ? Risk : Group;
                                        const label = option === 'random' ? "Au hasard" : "A la majorité";
                                        let background;
                                        if (checked) background = 'brand';
                                        else if (hover) background = 'light-4';
                                        else background = 'light-2';
                                        return (
                                            <Box background={background} pad="small" direction="row" gap="small">
                                                <Icon />
                                                <Text>{label}</Text>
                                            </Box>
                                        );
                                    }}
                                </RadioButtonGroup>
                            </FormField>

                            <FormField
                                label="Mode de choix"
                                name="cardinality"
                                required>
                                <RadioButtonGroup
                                    name="cardinality"
                                    options={[
                                        { value: "multiple", label: "Choix multiples" },
                                        { value: "unique", label: "Choix unique" }
                                    ]}
                                    direction="row"
                                />
                            </FormField>

                            {showFieldSuggest && (
                                <FormField name="suggest" label="Suggestions libres">
                                    <CheckBox
                                        name="suggest"
                                        label="Autoriser" />
                                </FormField>
                            )}

                            <FormField
                                name="choices" error={choices.length === 0 ? "Ce champ est requis" : ""}
                                label={
                                    <Box direction="row" align="center" justify="between">
                                        <Text>Choix possibles</Text>
                                        {choicesLists &&
                                            <Menu
                                                dropProps={
                                                    {
                                                        align: { bottom: 'bottom', left: 'left' },
                                                        elevation: "medium"
                                                    }}
                                                items={
                                                    choicesLists.map(l => (
                                                        {
                                                            label: <Box pad="small">
                                                                <Text>{l.name}</Text>
                                                            </Box>,
                                                            onClick: () => {
                                                                this.setState({ itemsFieldKey: "" + new Date().getTime(), choices: l.choices })
                                                            }
                                                        }))
                                                }
                                                icon={<NewWindow />}
                                                label="Remplir à partir d'une liste prédéfinie"
                                            >
                                            </Menu>}
                                    </Box>
                                }
                            >

                                <ItemsField
                                    key={itemsFieldKey}
                                    value={choices}
                                    onChange={(val) => this.setState({ choices: val })} />

                            </FormField>

                            {isError && (
                                <Box pad={{ horizontal: 'small' }}>
                                    <Text color="status-error">{errorMessage}</Text>
                                </Box>
                            )}

                            <Box direction="row" justify="center" margin={{ top: 'medium' }}>
                                <Button type="submit" label="Créer" disabled={loading} primary />
                            </Box>
                        </Form>
                    </Box>
                </Box>
                {
                    loading && <LoadingLayer />
                }
            </Box>
        )
    }
}

const WrappedComponent = withRouter(withAPIService(withFirebaseService(NewPick)));
export default WrappedComponent;
