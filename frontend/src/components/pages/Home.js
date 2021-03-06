import React, { useEffect, useState } from 'react';
import { Box, Button, Header, Heading, Text } from 'grommet';
import { Chat } from "grommet-icons";
import qs from "qs";
import { useLocation } from "react-router-dom";

import JoinPick from "./JoinPick";
import backgroundImg from "../../assets/lavalamps.jpg";
import { showJoinPickModal } from "../../store/actions/uiActions";
import { connect } from "react-redux";

const Home = ({ showJoinPick, showJoinPickModal }) => {
    let location = useLocation();
    const [showCookieBanner, setShowCookieBanner] = useState(true);
    const [presetCode, setPresetCode] = useState(undefined);
    useEffect(() => {
        const codeParam = qs.parse(location.search, { ignoreQueryPrefix: true }).__sharing_code;
        if (codeParam) {
            showJoinPickModal(true);
            setPresetCode(codeParam);
        }
    }, [location, showJoinPickModal]);

    return (
        <Box fill="horizontal">
            {showCookieBanner && <Header pad="small" background="neutral-2">

                Ce site utilise des cookies à des fins d'analyse et de mesure d'audience. En utilisant ce service, vous y consentez
                <Button label="Ok" onClick={() => setShowCookieBanner(false)} />
            </Header>}
            <Box fill align="center" gap="medium"
                background={
                    {
                        dark: false,
                        opacity: "weak",
                        position: "bottom",
                        repeat: "no-repeat",
                        size: "cover",
                        image: `url(${backgroundImg})`
                    }
                }
            >
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
                <Box pad="large"
                    animation={{
                        type: "fadeIn",
                        delay: 400,
                        duration: 2000
                    }}>
                    <Text>- Quel resto pour ce midi ?</Text>
                    <Text>- Quel prénom pour le bébé ?</Text>
                    <Text>- A quoi on joue ? Sirop, artichette, grelotine ou sloubi ?</Text>
                    <Text>...</Text>
                    <Heading level="2">Cette appli va mettre tout le monde d'accord</Heading>
                    <Text textAlign="end" weight="bold">en décidant à votre place.</Text>
                </Box>

                <Box>
                    <Button size="large" label="Rejoindre un vote" icon={<Chat />} primary onClick={() => showJoinPickModal(true)} />
                </Box>

                <Box pad="large" background="dark-2" fill="horizontal" align="center">
                    <Heading level="4">Comment ça marche ?</Heading>
                    <Box>
                        <Text>
                            1. Organisez le vote depuis votre compte et partagez son code
                    </Text>
                        <Text>
                            2. Vos invités rejoignent le vote pour y participer</Text>
                        <Text>
                            3. ???</Text>
                        <Text weight="bold">
                            4. Terminez le vote et découvrez le vainqueur !
                    </Text>
                    </Box>
                    <Box pad="medium">
                        <Text size="large" textAlign="center">Une appli pour choisir, au hasard ou à la majorité, sur tous les sujets, dans toutes les circonstances</Text>
                    </Box>
                </Box>
                {
                    showJoinPick &&
                    <JoinPick
                        presetCode={presetCode}
                        onClose={() => showJoinPickModal(false)} />
                }
            </Box>
        </Box>
    )
}

const mapStateToProps = (state) => {
    return {
        showJoinPick: state.ui.showJoinPick
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        showJoinPickModal: (show) => dispatch(showJoinPickModal(show))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
