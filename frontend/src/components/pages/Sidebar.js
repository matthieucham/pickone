import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
    Box,
    Button,
    Header,
    Sidebar,
    Text
} from 'grommet';
import { CircleInformation, FormClose, User } from 'grommet-icons';

import JoinPick from '../login/JoinPick';

import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";


const AppSidebar = ({ user, onCloseButtonClick, onAnonymousLogin, signOut, ...props }) => {
    const history = useHistory();
    const [openCodeDialog, setOpenCodeDialog] = useState(false);
    const isLoggedIn = user && !user.anonymous;
    const menuLinks = [
        { label: "Accueil", path: "/" },
        { label: "Rejoindre un vote", onClick: () => setOpenCodeDialog(true) }
    ];
    if (user) {
        menuLinks.push({ label: "Mes votes", path: "/dashboard" });
    }
    if (isLoggedIn) {
        menuLinks.push({ label: "Nouveau vote", path: "/newpick" }, { label: "Mes listes", path: "/lists" });
    }
    return (
        <Sidebar width="medium" background="brand" pad="xsmall"
            footer=
            {
                <Button hoverIndicator onClick={() => { history.push("/about"); onCloseButtonClick() }}>
                    <Box pad={{ horizontal: "medium", vertical: "small" }} align="end">
                        <Text weight="bold">A propos</Text>
                    </Box>
                </Button>
            }
            {...props}
        >
            <Header justify="end">
                <Button icon={<FormClose color="light-1" />}
                    onClick={onCloseButtonClick}
                    pad="xsmall" />
            </Header>
            <Box>
                <Box>
                    {menuLinks.map((ml) => (
                        <Box border="bottom" key={`menu${ml.label.replace(" ", "_")}`}>
                            <Button
                                hoverIndicator
                                onClick={() => {
                                    if (ml.onClick) {
                                        ml.onClick();
                                    }
                                    if (ml.path) {
                                        history.push(ml.path);
                                    }
                                    onCloseButtonClick()
                                }
                                }>
                                <Box pad={{ horizontal: "medium", vertical: "small" }} align="start">
                                    <Text weight="bold">{ml.label}</Text>
                                </Box>
                            </Button>
                        </Box>
                    ))}
                </Box>
                <Box margin={{ vertical: "large", horizontal: "none" }}>
                    {
                        isLoggedIn ? (
                            <Box border="bottom">
                                <Button hoverIndicator onClick={signOut}>
                                    <Box pad={{ horizontal: "medium", vertical: "small" }} align="start">
                                        <Text weight="bold" color="accent-1">Déconnexion</Text>
                                    </Box>
                                </Button>
                            </Box>
                        ) : (
                                user ? (
                                    <Box>
                                        <Box border="bottom">
                                            <Button hoverIndicator onClick={() => { history.push("/register"); onCloseButtonClick() }}>
                                                <Box pad={{ horizontal: "medium", vertical: "small" }} align="start">
                                                    <Text weight="bold" color="accent-1">Créer un compte</Text>
                                                </Box>
                                            </Button>
                                        </Box>
                                        <Box direction="row" align="center" justify="center">
                                            <Box pad="xsmall">
                                                <CircleInformation />
                                            </Box>
                                            <Box pad="xsmall" flex>
                                                <Text size="small">Avec un compte vous pourrez organiser des votes</Text>
                                            </Box>
                                        </Box>
                                    </Box>
                                ) : (
                                        <Box border="bottom">
                                            <Button hoverIndicator onClick={() => { history.push("/login"); onCloseButtonClick() }}>
                                                <Box pad={{ horizontal: "medium", vertical: "small" }} align="start">
                                                    <Text weight="bold" color="accent-1">Se connecter</Text>
                                                </Box>
                                            </Button>
                                        </Box>

                                    )
                            )
                    }
                    {user &&
                        <Box direction="row" align="center" justify="center">
                            <Box pad="xsmall">
                                <User />
                            </Box>
                            <Box direction="row" pad="xsmall" flex align="center" gap="xsmall">
                                <Text weight="bold">{user.displayName}</Text>
                                {
                                    user.anonymous &&
                                    <Button plain icon={<FormClose />} label="(invité)" onClick={signOut} hoverIndicator pad="xsmall" reverse />
                                }
                            </Box>
                        </Box>}
                </Box>
            </Box>
            {
                openCodeDialog &&
                <JoinPick user={user}
                    onClose={() => setOpenCodeDialog(false)}
                    onAnonymousLogin={onAnonymousLogin} />
            }
        </Sidebar>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut())
    }
}

export default connect(null, mapDispatchToProps)(AppSidebar);