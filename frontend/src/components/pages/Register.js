import React, { useState } from 'react';
import {
    Box, Button, Form, FormField, Heading, Text, TextInput
} from 'grommet';
import { connect } from "react-redux";

import { createAccount, registerAnonymous } from "../../store/actions/authActions";

const Register = ({ auth, displayName, error, fetching, createAccount, registerAnonymous }) => {
    const [username, setUsername] = useState(displayName);
    const [displayedError, setDisplayedError] = useState(error);

    const onSubmit = ({ value }) => {
        if (value.password !== value.confirm) {
            setDisplayedError("Le mot de passe et sa confirmation doivent être identiques");
            return
        }
        const cred = {
            email: value.email,
            password: value.password,
            displayName: username
        }
        if (auth.uid) {
            // Link anonymous account
            registerAnonymous(cred);
        } else {
            createAccount(cred);
        }
    }

    return (<Box align="center" pad="small">
        <Heading level="3">Inscription</Heading>
        <Box align="center" justify="center">
            <Box width="medium">
                <Form
                    onSubmit={onSubmit}
                >
                    <FormField label="Pseudo" name="display" required>
                        <TextInput name="display" type="text"
                            value={username}
                            onChange={event => setUsername(event.target.value)} />
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

                    {displayedError && (
                        <Box pad={{ horizontal: 'small' }}>
                            <Text color="status-error">{displayedError}</Text>
                        </Box>
                    )}

                    <Box direction="row" justify="center" margin={{ top: 'medium' }}>
                        <Button type="submit" label="S'inscrire" disabled={fetching} primary />
                    </Box>
                </Form>
            </Box>
            {/* <Box width="medium" margin="medium">
                <Text>Ou bien connectez-vous à l'aide d'un compte externe</Text>
                <SocialNetworks />
            </Box> */}
        </Box>

    </Box>)
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        displayName: state.auth.anonymousDisplayName,
        error: state.auth.authError,
        fetching: state.ui.fetching
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createAccount: (credentials) => dispatch(createAccount(credentials)),
        registerAnonymous: (credentials) => dispatch(registerAnonymous(credentials))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
