import React, { Component } from 'react';
import {
    Box, Button, CheckBox, Form, FormField, Heading, Layer, Menu, RadioButtonGroup, Text, TextArea, TextInput
} from 'grommet';
import { CloudUpload, Group, NewWindow, Risk } from 'grommet-icons';
import { withRouter } from 'react-router-dom';

import { withAPIService, withFirebaseService } from '../../hoc';
import ItemsField from '../fields/ItemsField';
import LoadingLayer from "../lib/LoadingLayer";


class SaveListLayer extends Component {

    state = {
        loading: false,
        errorMessage: ""
    }

    handleSubmit = async ({ value }) => {
        await this.setState({
            errorMessage: "",
            loading: true
        });

        const user = this.props.user;
        const method = 'POST';
        const url = 'picks/lists/';
        try {
            const response = await this.props.APIService.callAPIWithAuth(
                url,
                user.idToken,
                {
                    method: method,
                    body: JSON.stringify({ ...value, choices: this.props.choices }),
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            ).then(response => response.json());
            if ("error" in response) {
                this.setState({ loading: false, errorMessage: response.error });
            } else {
                this.setState({ loading: false });
                this.props.onCancelAction();
            }
        } catch (e) {
            this.setState({ loading: false, errorMessage: e.message });
        }
    }

    render() {
        const { onCancelAction } = this.props;
        const { loading, errorMessage } = this.state;
        return (
            <Layer position="center" onClickOutside={onCancelAction} onEsc={onCancelAction}>
                <Box pad="medium" gap="small" width="medium">
                    <Heading level={3} margin="none">Enregistrer comme liste</Heading>
                    <Text>Vous pourrez retrouver cette liste de choix dans vos listes prédéfinies et la réutiliser pour d'autres votes.</Text>
                    <Form onSubmit={this.handleSubmit}>
                        <FormField label="Nom de la liste" name="name" required>
                            <TextInput name="name" type="text" placeholder="Nom" />
                        </FormField>
                        {errorMessage &&
                            <Text color="status-error">{errorMessage}</Text>
                        }
                        <Box
                            as="footer"
                            gap="small"
                            direction="row"
                            align="center"
                            justify="end"
                            pad={{ top: 'medium', bottom: 'small' }}
                        >
                            <Button label="Annuler" onClick={onCancelAction} color="dark-3" />
                            <Button
                                label="Enregistrer"
                                type="submit"
                                disabled={loading}
                                primary
                            />
                        </Box>
                    </Form>
                </Box>
                {
                    loading &&
                    <LoadingLayer />
                }
            </Layer>
        );
    }
}
const WrappedSaveListLayer = withAPIService(SaveListLayer);


class NewPick extends Component {

    state = {
        isError: false,
        errorMessage: '',
        loading: false,
        showFieldSuggest: false,
        multipleSelected: false,
        choices: [],
        choicesLists: undefined,
        itemsFieldKey: "empty",
        itemsEdited: false,
        showSaveListLayer: false
    }

    componentDidMount() {
        this._isMounted = true;
        const user = this.props.user;
        this._isMounted && this.props.FirebaseService.getDb().collection('users/' + user.id + '/lists/').orderBy('name').get().then(snapshot => {
            if (snapshot.empty) {
                this._isMounted && this.setState({ choicesLists: undefined });
            } else {
                let lists = snapshot.docs.map(doc => doc.data());
                this._isMounted && this.setState({ choicesLists: lists });
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
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
        const { isError, errorMessage, loading, showFieldSuggest, choices, choicesLists, itemsFieldKey, multipleSelected, showSaveListLayer, itemsEdited } = this.state;
        const { user } = this.props;
        return (
            <Box align="center" pad="small">
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
                                    onChange={event => this.setState({ multipleSelected: event.target.value === 'multiple' })}
                                />
                            </FormField>

                            {showFieldSuggest && multipleSelected && (
                                <FormField name="suggest" label="Suggestions libres">
                                    <CheckBox
                                        name="suggest"
                                        label="Autoriser" />
                                </FormField>
                            )}

                            <FormField
                                name="choices" error={choices.length === 0 ? "Ce champ est requis" : ""}
                                label={
                                    <Box direction="row" align="center" justify="between" wrap>
                                        <Text>Choix possibles</Text>
                                        <Box direction="row" gap="xsmall" align="stretch" wrap>
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
                                                                    this.setState({ itemsFieldKey: "" + new Date().getTime(), choices: l.choices, itemsEdited: false })
                                                                }
                                                            }))
                                                    }
                                                    icon={<NewWindow />}
                                                    label="Remplir à partir d'une liste prédéfinie"
                                                    hoverIndicator
                                                    size="small"
                                                >
                                                </Menu>
                                            }
                                            {choices.length > 0 &&
                                                <Button plain
                                                    icon={<CloudUpload />}
                                                    label={<Text size="small">Enregistrer comme liste</Text>}
                                                    focusIndicator={false}
                                                    disabled={!itemsEdited}
                                                    hoverIndicator onClick={() => { this.setState({ showSaveListLayer: true }) }}
                                                    reverse />
                                            }
                                        </Box>
                                    </Box>
                                }
                            >

                                <ItemsField
                                    key={itemsFieldKey}
                                    value={choices}
                                    onChange={(val) => this.setState({ choices: val, itemsEdited: true })} />

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
                    showSaveListLayer &&
                    <WrappedSaveListLayer
                        user={user}
                        choices={choices}
                        onCancelAction={() => { this.setState({ showSaveListLayer: false }) }} />
                }
                {
                    loading &&
                    <LoadingLayer />
                }
            </Box>
        )
    }
}

const WrappedComponent = withRouter(withAPIService(withFirebaseService(NewPick)));
export default WrappedComponent;
