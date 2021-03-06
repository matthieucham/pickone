import React, { Component } from 'react';
import {
    Box, Button, Form, FormField, Heading, Text, TextInput
} from 'grommet';
import SocialNetworks from '../login/SocialNetworks';
import { Link } from 'react-router-dom';

import { connect } from "react-redux";
import { signIn } from "../../store/actions/authActions";

class Login extends Component {

    handleSubmit = ({ value }) => {
        this.props.signIn(value);
    }

    render() {
        const { errorMessage, loading } = this.props;
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

                            {errorMessage && (
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
            </Box>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.ui.fetching,
        errorMessage: state.auth.authError
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (creds) => dispatch(signIn(creds))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);