import React, { Component } from 'react';
import {
    Box, Button, Form, FormField, Heading, Text, TextInput
} from 'grommet';
import firebase from 'firebase/app';


import { withFirebaseService } from '../../hoc';
import LoadingLayer from "../lib/LoadingLayer";
import SocialNetworks from '../login/SocialNetworks';


class Register extends Component {

    state = {
        isError: false,
        errorMessage: '',
        loading: false,
        username: this.props.user ? this.props.user.displayName : "",
    }

    validate = (value) => {
        if (value.password !== value.confirm) {
            this.setState({
                errorMessage: 'Le mot de passe et sa confirmation doivent être identiques',
                isError: true,
                loading: false
            })
            return false;
        }
        return true;
    }

    handleSubmit = async ({ value }) => {

        await this.setState({
            isError: false,
            errorMessage: '',
            loading: true
        });
        if (this.validate(value)) {
            try {
                if (!this.props.user) {
                    const createUserResponse = await this.props.FirebaseService.getAuth().createUserWithEmailAndPassword(value.email, value.password);
                    await createUserResponse.user.updateProfile({ displayName: value.display });
                    if (this.props.onDisplayNameChanged) {
                        this.props.onDisplayNameChanged(value.display, true);
                    }
                }
                else if (this.props.user.anonymous) {
                    const credential = firebase.auth.EmailAuthProvider.credential(value.email, value.password);
                    const usercred = await this.props.FirebaseService.getAuth().currentUser.linkWithCredential(credential);
                    await usercred.user.updateProfile({ displayName: value.display });
                    if (this.props.onDisplayNameChanged) {
                        this.props.onDisplayNameChanged(value.display, true);
                    }
                }
            } catch (err) {
                this.setState({
                    errorMessage: err.message,
                    isError: true,
                    loading: false
                });
                return
            }
        }
        this.setState({
            loading: false,
            errorMessage: '',
            isError: false
        });

    }

    render() {
        const { isError, errorMessage, loading, username } = this.state;
        return (
            <Box align="center" pad="small">
                <Heading level="3">Inscription</Heading>
                <Box align="center" justify="center">
                    <Box width="medium">
                        <Form
                            onSubmit={this.handleSubmit}
                        >
                            <FormField label="Pseudo" name="display" required>
                                <TextInput name="display" type="text"
                                    value={username}
                                    onChange={event => this.setState({ username: event.target.value })} />
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
                {
                    loading && <LoadingLayer />
                }
            </Box>
        )
    }
}

const WrappedComponent = withFirebaseService(Register);

export default WrappedComponent;