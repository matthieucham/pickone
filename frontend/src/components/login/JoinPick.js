import React, { Component } from 'react';
import { Box, Button, Form, FormField, Header, Heading, Layer, Text, TextInput } from 'grommet';
import { CircleInformation, FormClose, User } from "grommet-icons";
import { withRouter } from 'react-router-dom';

import { RouterAnchor } from "../ext/RoutedControls";
import LoadingLayer from "../lib/LoadingLayer";
import { withFirebaseService, withAPIService } from '../../hoc';

class EnterCodeLayer extends Component {

    state = {
        loading: false,
        error: undefined,
        codeValue: this.props.presetCode,
    }

    onSubmit = async ({ value }) => {
        await this.setState({
            error: "",
            loading: true,
        });

        let userIdToken;
        if (this.props.user) {
            userIdToken = this.props.user.idToken;
        } else {
            // Anonymous login
            try {
                const result = await this.props.FirebaseService.getAuth().signInAnonymously();
                await result.user.updateProfile({ displayName: value.name });
                userIdToken = await result.user.getIdToken();
            } catch (error) {
                await this.setState({
                    error: error.message,
                    loading: false
                });
                return;
            }
            if (this.props.onAnonymousLogin) {
                this.props.onAnonymousLogin(value.name);
            }
        }

        try {
            const response = await this.props.APIService.callAPIWithAuth(
                `picks/registrations/`,
                userIdToken,
                {
                    method: 'POST',
                    body: JSON.stringify({ code: value.code }),
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            ).then(response => response.json());
            if ("error" in response) {
                this.setState({ loading: false, error: response.error });
            } else {
                this.setState({
                    loading: false,
                });
                this.props.onClose()
                this.props.history.push(`/pick/${response.pickId}`);
            }
        } catch (e) {
            this.setState({ loading: false, error: e.message });
        }
    }

    render() {
        const { user, onClose } = this.props;
        const { loading, error } = this.state;
        return (
            <Layer position="center" onClickOutside={onClose} onEsc={onClose} responsive>
                <Header pad="small">
                    <Heading level={3} margin="none">Rejoindre un vote</Heading>

                    <Button icon={<FormClose />}
                        onClick={onClose}
                        pad="xsmall" />
                </Header>
                <Box pad="medium" gap="small" width="medium" fill>

                    <Form onSubmit={this.onSubmit}>
                        {user ?
                            (<Button plain icon={<User />}
                                label={user.displayName + (user.anonymous ? " (invité)" : "")}
                                margin={{ horizontal: "small", vertical: "none" }}
                            />
                            ) : (
                                <FormField name="name" required label="Pseudo :">
                                    <TextInput name="name" type="text" placeholder="Pseudo" />
                                </FormField>
                            )
                        }
                        <FormField name="code" required label="Saisissez le code de partage que l'organisateur du vote vous aura communiqué :">
                            <TextInput
                                name="code"
                                type="text"
                                placeholder="Code de partage"
                                value={this.state.codeValue}
                                onChange={(e) => this.setState({ codeValue: e.target.value })} />
                        </FormField>
                        {
                            error &&
                            <Box align="center" pad={{ horizontal: "xsmall", vertical: "small" }}>
                                <Text color="status-error">{error}</Text>
                            </Box>
                        }
                        <Box direction="row" align="center" justify="center" background="light-3">
                            <Box pad="xsmall">
                                <CircleInformation />
                            </Box>
                            <Box pad="xsmall" flex>
                                <Text size="small">Pas de code ? Pas de problème</Text>
                                <Text size="small">identifiez-vous et organisez votre propre vote</Text>
                                <RouterAnchor path="/login" size="small">S'identifier</RouterAnchor>
                            </Box>
                        </Box>

                        <Box
                            as="footer"
                            gap="small"
                            direction="row"
                            align="center"
                            justify="center"
                            pad={{ top: 'medium', bottom: 'small' }}
                        >
                            <Button
                                label="Envoyer le code"
                                primary
                                type="submit"
                            />
                        </Box>
                    </Form>
                </Box>
                {
                    loading && <LoadingLayer />
                }
            </Layer>
        )
    }
}

const FbEnterCodeLayer = withAPIService(withRouter(withFirebaseService(EnterCodeLayer)));
export default FbEnterCodeLayer;