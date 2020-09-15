import React from "react";
import { Box, Button, Text } from "grommet";
import { Notification } from "grommet-icons";
import { toast } from "react-toastify";


import { RouterAnchor } from "../ext/RoutedControls";
import { onMessageListener } from "../../config/fbConfig";
import PushMessageToast from "../lib/PushMessageToast";

const Messaging = () => {
    onMessageListener()
        .then((payload) => {
            const { pickId, pickTitle, pickStatus } = payload.data;
            if (pickStatus === "TERMINATED") {
                toast(
                    <PushMessageToast appearance="info">
                        <Box>
                            <Text>Vote terminé : {pickTitle}</Text>
                            <RouterAnchor path={`/pick/${pickId}`} label="Cliquer pour voir le résultat" />
                        </Box>
                    </PushMessageToast>
                )
            } else if (pickStatus === "CANCELLED") {
                toast(
                    <PushMessageToast appearance="warning">
                        <Text>{`Vote annulé : ${pickTitle}`}</Text>
                    </PushMessageToast>
                )
            }

        });
    return (
        <Button icon={<Notification color="brand" />}
            onClick={() => { }}
            pad="xsmall" />);
}

export default Messaging;