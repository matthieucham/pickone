import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Box, Button, Form, FormField, Heading, Text, TextInput
} from 'grommet';
import { useHistory } from "react-router-dom";

import firebase from 'firebase/app';

import { withFirebaseService } from '../../hoc';
import SocialNetworks from '../login/SocialNetworks';
import { Link } from 'react-router-dom';


class Login extends Component {

    state = {
        isError: false,
        errorMessage: '',
        loading: false
    }

    handleSubmit = async ({ value, touched }) => {

        await this.setState({
            isError: false,
            errorMessage: '',
            loading: true
        });

        this.props.FirebaseService.getAuth().signInWithEmailAndPassword(value.email, value.password)
            .then((result) => {
                console.log(result);
            }).catch(async (error) => {
                await this.setState({
                    errorMessage: error.message,
                    isError: true,
                    loading: false
                });
            })

    }

    render() {
        const { isError, errorMessage, loading } = this.state;
        return (
            <Box>
                <Heading level="2">Login</Heading>
                <Box fill align="center" justify="center">
                    <Box width="medium">
                        <Form
                            onSubmit={this.handleSubmit}
                        >

                            <FormField label="Adresse e-mail" name="email" ref={this.emailRef} required>
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
                    <Box width="medium" margin="medium">
                        <Text>Ou bien avec</Text>
                        <SocialNetworks />
                    </Box>
                </Box>
            </Box>
        )
    }
}

const WrappedComponent = withFirebaseService(Login);

export default WrappedComponent;