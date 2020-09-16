import React, { Component } from 'react';
import { Anchor, Box, Button, Form, FormField, Header, Heading, Layer, Text, TextInput } from 'grommet';
import { CircleInformation, FormClose, User } from "grommet-icons";
import { withRouter } from "react-router-dom";

import { compose } from "redux";
import { connect } from "react-redux";
import { joinPick } from "../../store/actions/pickActions";
import { showJoinPickModal } from "../../store/actions/uiActions";

class EnterCodeLayer extends Component {

    state = {
        codeValue: this.props.presetCode || "",
    }

    onSubmit = ({ value }) => {
        this.props.joinPick(value.code, value.name, this.props.history);
    }

    render() {
        const { onClose, auth, anonymousDisplayName, error, showJoinPickModal } = this.props;
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
                        {auth.uid ?
                            (<Button plain icon={<User />}
                                label={(auth.displayName || anonymousDisplayName) + (auth.isAnonymous ? " (invité)" : "")}
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
                                <Anchor size="small" onClick={() => {
                                    this.props.history.push("/login");
                                    showJoinPickModal(false);
                                }
                                }>S'identifier</Anchor>
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
            </Layer >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        anonymousDisplayName: state.auth.anonymousDisplayName,
        error: state.pick.joinError
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        joinPick: (code, name, history) => dispatch(joinPick(code, name, history)),
        showJoinPickModal: (show) => dispatch(showJoinPickModal(show))
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(EnterCodeLayer);