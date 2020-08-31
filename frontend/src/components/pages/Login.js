import React, { Component } from 'react';
import {
    Box, Button, Form, FormField, Heading, Text, TextInput
} from 'grommet';
//import firebase from 'firebase/app';
import { withFirebaseService } from '../../hoc';
import SocialNetworks from '../login/SocialNetworks';
import LoadingLayer from "../lib/LoadingLayer";
import { Link } from 'react-router-dom';


class Login extends Component {

    state = {
        isError: false,
        errorMessage: '',
        loading: false
    }

    handleSubmit = async ({ value }) => {

        await this.setState({
            isError: false,
            errorMessage: '',
            loading: true
        });
        try {
            if (!this.props.user) {
                await this.props.FirebaseService.getAuth().signInWithEmailAndPassword(value.email, value.password);
                // } else if (this.props.user.anonymous) {
                //     const credential = firebase.auth.EmailAuthProvider.credential(value.email, value.password);
                //     const usercred = await this.props.FirebaseService.getAuth().currentUser.linkWithCredential(credential);
                //     if (this.props.onDisplayNameChanged) {
                //         this.props.onDisplayNameChanged(usercred.user.displayName, true);
                //     }
            }
            await this.setState({
                errorMessage: "",
                isError: false,
                loading: false
            });
        } catch (error) {
            await this.setState({
                errorMessage: error.message,
                isError: true,
                loading: false
            });
        }

    }

    render() {
        const { isError, errorMessage, loading } = this.state;
        return (
            <Box align="center" pad="small">
                <Heading level="3">Login</Heading>
                <Box align="center" justify="center">
                    <Box width="medium">
                        <Form
                            onSubmit={this.handleSubmit}
                        >

                            <FormField label="Adresse e-mail" name="email" required>
                                <TextInput name="email" type="email" />
                            </FormField>

                            <FormField label="Mot de passe" name="password" required>
                                <TextInput name="password" type="password" />
                            </FormField>

                            {isError && (
                                <Box pad={{ horizontal: 'small' }}>
                                    <Text color="status-error">{errorMessage}</Text>
                                </Box>
                            )}

                            <Box direction="row" justify="center" margin="medium">
                                <Button type="submit" label="Login" disabled={loading} primary />
                            </Box>
                        </Form>
                        <Box direction="row" justify="center" margin="medium" gap="small">
                            <Text>Pas encore inscrit ?</Text>
                            <Link to="/register">S'inscrire</Link>
                        </Box>
                    </Box>
                    <Box width="medium" margin="medium" flex={false}>
                        <Text>Ou bien avec</Text>
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

const WrappedComponent = withFirebaseService(Login);

export default WrappedComponent;