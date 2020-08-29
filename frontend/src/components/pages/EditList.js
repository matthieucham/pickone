import React, { Component } from 'react';
import {
    Box, Button, Form, FormField, Heading, Text, TextInput
} from 'grommet';
import { withRouter } from 'react-router-dom';

import { withAPIService, withFirebaseService } from '../../hoc';
import ItemsField from '../fields/ItemsField';
import LoadingLayer from "../lib/LoadingLayer";


class EditList extends Component {

    state = {
        errorMessage: "",
        loading: false,
        name: "",
        choices: [],
        initialContentLoaded: false
    }

    componentDidMount() {
        const user = this.props.user;
        if (this.props.match.params.id) {
            this.setState({loading: true});
            this.props.FirebaseService.getDb().collection('users/' + user.id + '/lists/').doc(this.props.match.params.id).get().then(list => {
                if (list.exists) {
                    this.setState({ 
                        name: list.data().name,
                        choices: list.data().choices,
                        loading: false,
                        initialContentLoaded: true
                    });
                } else {
                    this.setState({ name: "", choices: [], loading: false, initialContentLoaded: true });
                }
            });
        } else {
            this.setState({initialContentLoaded: true})
        }
    }

    handleSubmit = async ({ value }) => {

        await this.setState({
            errorMessage: "",
            loading: true
        });

        const user = this.props.user;
        const method = this.props.match.params.id ? 'PUT' : 'POST';
        const url = this.props.match.params.id ? `picks/lists/${this.props.match.params.id}` : 'picks/lists/';
        try {
            const response = await this.props.APIService.callAPIWithAuth(
                url,
                user.idToken,
                {
                    method: method,
                    body: JSON.stringify({ ...value, choices: this.state.choices }),
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            ).then(response => response.json());
            if ("error" in response) {
                this.setState({ loading: false, errorMessage: response.error });
            } else {
                this.setState({ loading: false });
                this.props.history.push(`/lists`);
            }
        } catch (e) {
            this.setState({ loading: false, errorMessage: e.message });
        }
    }

    render() {
        const { errorMessage, loading, choices, name, initialContentLoaded } = this.state;
        return (
            <Box align="center">
                {
                    (this.props.match.params.id) ? 
                    (<Heading level="3">Edition d'une liste prédéfinie</Heading>):
                    (<Heading level="3">Créer une liste prédéfinie</Heading>)
                    
                } 
                <Box align="center" justify="center">
                    <Box width="large">
                        <Form
                            onSubmit={this.handleSubmit}
                        >
                            <FormField label="Nom de la liste" name="name" required>
                                <TextInput name="name" 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => this.setState({ name: e.target.value })} />
                            </FormField>

                            {initialContentLoaded &&
                                <FormField label="Choix"
                                    name="choices"
                                    error={choices.length === 0 ? "Ce champ est requis" : ""}>

                                    <ItemsField value={choices}
                                        onChange={(val) => this.setState({ choices: val })} />

                                </FormField>
                            }

                            {errorMessage && (
                                <Box pad={{ horizontal: 'small' }}>
                                    <Text color="status-error">{errorMessage}</Text>
                                </Box>
                            )}

                            <Box direction="row" justify="center" margin={{ top: 'medium' }}>
                                <Button type="submit" label="Enregistrer" disabled={loading} primary />
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

const WrappedComponent = withRouter(withAPIService(withFirebaseService(EditList)));
export default WrappedComponent;
