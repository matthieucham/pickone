import React, { useState } from 'react';
import { Box, Button, Heading, Text } from 'grommet';
import { Chat } from "grommet-icons";

import JoinPick from "../login/JoinPick";

const Home = ({ user, onAnonymousLogin }) => {
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
                <JoinPick user={user}
                    onClose={() => setOpenCodeDialog(false)}
                    onAnonymousLogin={onAnonymousLogin} />
            }
        </Box>
    )
}

export default Home;