import React, { Component } from 'react';
import {
    Box, Button, CheckBox, Form, FormField, Heading, RadioButtonGroup, Text, TextInput
} from 'grommet';
import { Group, Risk } from 'grommet-icons';
import { withRouter } from 'react-router-dom';

import { withAPIService } from '../../hoc';
import ItemsField from '../fields/ItemsField';


class NewPick extends Component {

    state = {
        isError: false,
        errorMessage: '',
        loading: false,
        showFieldSuggest: false,
        choices: []
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
                console.log(response.pickId);
                this.setState({ loading: false });
                this.props.history.push(`/pick/${response.pickId}`);
            }
        } catch (e) {
            this.setState({ loading: false, isError: true, errorMessage: e.message });
        }
    }

    render() {
        const { isError, errorMessage, loading, showFieldSuggest, choices } = this.state;
        return (
            <Box align="center">
                <Heading level="3">Organiser un Pick</Heading>
                <Box fill align="center" justify="center">
                    <Box width="large">
                        <Form
                            onSubmit={this.handleSubmit}
                        >
                            <FormField label="Titre" name="title" required>
                                <TextInput name="title" type="text" placeholder="Titre" />
                            </FormField>

                            {/* <FormField label="Description" name="description">
                                <TextArea placeholder="Description, contexte, etc." />
                            </FormField> */}

                            <FormField label="Mode de choix" name="mode" required>
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

                            {showFieldSuggest && (
                                <FormField name="suggest" label="Suggestions libres">
                                    <CheckBox
                                        name="suggest"
                                        label="Autoriser" />
                                </FormField>
                            )}

                            <FormField label="Choix possibles" name="choices" error={choices.length === 0 ? "Ce champ est requis" : ""}>

                                <ItemsField value={choices}
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
            </Box>
        )
    }
}

const WrappedComponent = withRouter(withAPIService(NewPick));
export default WrappedComponent;
