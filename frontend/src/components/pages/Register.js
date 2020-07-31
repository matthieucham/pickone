import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Box, Button, Form, FormField, Heading, Text, TextInput
} from 'grommet';

import firebase from 'firebase/app';

import { withFirebaseService } from '../../hoc';
import SocialNetworks from '../login/SocialNetworks';


class Register extends Component {

    state = {
        isError: false,
        errorMessage: '',
        loading: false
    }

    validate = (value) => {
        if (value.password != value.confirm) {
            this.setState({
                errorMessage: 'Le mot de passe et sa confirmation doivent être identiques',
                isError: true,
                loading: false
            })
            return false;
        }
        return true;
    }

    handleSubmit = async ({ value, touched }) => {

        await this.setState({
            isError: false,
            errorMessage: '',
            loading: true
        });
        if (this.validate(value)) {
            this.props.FirebaseService.getAuth().createUserWithEmailAndPassword(value.email, value.password)
                .then(result => result.user.updateProfile({ displayName: value.display }))
                .then(data => {
                    this.setState({
                        loading: false,
                        errorMessage: '',
                        isError: false
                    });
                })
                .catch(err => {
                    this.setState({
                        errorMessage: err.message,
                        isError: true,
                        loading: false
                    });
                });
        }

    }

    render() {
        const { isError, errorMessage, loading } = this.state;
        return (
            <Box>
                <Heading level="2">Inscription</Heading>
                <Box fill align="center" justify="center">
                    <Box width="medium">
                        <Form
                            onSubmit={this.handleSubmit}
                        >
                            <FormField label="Pseudo" name="display" required>
                                <TextInput name="display" type="text" />
                            </FormField>

                            <FormField label="Adresse e-mail" name="email" required>
                                <TextInput name="email" type="email" />
                            </FormField>

                            <FormField label="Mot de passe" name="password" required>
                                <TextInput name="password" type="password" />
                            </FormField>

                            <FormField label="Confirmation du mot de passe" name="confirm" required>
                                <TextInput name="confirm" type="password" />
                            </FormField>

                            {isError && (
                                <Box pad={{ horizontal: 'small' }}>
                                    <Text color="status-error">{errorMessage}</Text>
                                </Box>
                            )}

                            <Box direction="row" justify="center" margin={{ top: 'medium' }}>
                                <Button type="submit" label="S'inscrire" disabled={loading} primary />
                            </Box>
                        </Form>
                    </Box>
                    <Box width="medium" margin="medium">
                        <Text>Ou bien connectez-vous à l'aide d'un compte externe</Text>
                        <SocialNetworks />
                    </Box>
                </Box>
            </Box>
        )
    }
}

const WrappedComponent = withFirebaseService(Register);

export default WrappedComponent;