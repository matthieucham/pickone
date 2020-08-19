import React, { useState, Component } from 'react';
import { Box, Button, Form, FormField, Header, Heading, Layer, Text, TextInput } from 'grommet';
import { Chat, CircleInformation, FormClose } from "grommet-icons";
import { withRouter } from 'react-router-dom';

import { RouterAnchor } from "../ext/RoutedControls";
import LoadingLayer from "../lib/LoadingLayer";
import { withFirebaseService, withAPIService } from '../../hoc';




class EnterCodeLayer extends Component {

    state = {
        loading: false,
        error: undefined
    }

    onSubmit = async ({ value }) => {
        await this.setState({
            error: "",
            loading: true,
        });

        let user = this.props.user;
        if (!user) {
            // Anonymous login
            try {
                const result = await this.props.FirebaseService.getAuth().signInAnonymously();
                await result.user.updateProfile({ displayName: value.name });
                user = result.user;
            } catch (error) {
                await this.setState({
                    error: error.message,
                    loading: false
                });
                return;
            }
        }

        try {
            const response = await this.props.APIService.callAPIWithAuth(
                `picks/registrations/`,
                user.idToken,
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
                    <Text>Saisissez le code de partage que l'organisateur du vote vous aura communiqué</Text>
                    <Form onSubmit={this.onSubmit}>
                        <FormField name="code" required>
                            <TextInput name="code" type="text" placeholder="Code de partage" />
                        </FormField>
                        {
                            !user &&
                            <FormField name="name" required>
                                <TextInput name="name" type="text" placeholder="Pseudo" />
                            </FormField>
                        }

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

const Home = ({ user, onUserProfileUpdated }) => {
    const [openCodeDialog, setOpenCodeDialog] = useState(false);
    return (
        <Box fill align="center" gap="medium">
            <Box direction="row" align="center" justify="center" gap="small">
                <Box animation={{
                    type: "fadeIn",
                    delay: 0,
                    duration: 500
                }}>
                    <Chat size="large" />
                </Box>
                <Box animation={{
                    type: "fadeIn",
                    delay: 100,
                    duration: 500
                }}>
                    <Heading level="1">On</Heading>
                </Box>
                <Box animation={{
                    type: "fadeIn",
                    delay: 200,
                    duration: 500
                }}>
                    <Heading level="1">vote ?</Heading>
                </Box>
            </Box>
            <Box pad="large" background="neutral-3"
                animation={{
                    type: "fadeIn",
                    delay: 400,
                    duration: 2000
                }}>
                <Text>Quel resto ?</Text>
                <Text>Quel prénom pour le bébé ?</Text>
                <Text>Claude, Teheiura ou Tirié ?</Text>
                <Text>Il bluffe ou il bluffe pas ?</Text>
                <Text>...</Text>
                <Heading level="2">Cette appli va mettre tout le monde d'accord</Heading>
                <Text textAlign="end" weight="bold">en décidant à votre place.</Text>
            </Box>

            <Box>
                <Button size="large" label="Rejoindre un vote" primary onClick={() => setOpenCodeDialog(true)} />
            </Box>
            {
                openCodeDialog &&
                <FbEnterCodeLayer user={user}
                    onClose={() => setOpenCodeDialog(false)}
                    onUserProfileUpdated={onUserProfileUpdated} />
            }
        </Box>
    )
}

export default Home;