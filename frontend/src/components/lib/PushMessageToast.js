import React from 'react';
import { Box, Button, Grommet, Text } from "grommet";
import { FormClose, Notification, StatusWarning } from "grommet-icons";

const theme = {
    global: {
        font: {
            family: 'Roboto',
            size: '18px',
            height: '20px',
        }
    },
};

const PushMessageToast = ({ appearance, children, onDismiss }) => (
    <Grommet theme={theme}>
        <Box
            align="center"
            direction="row"
            gap="small"
            justify="between"
            elevation="medium"
            pad="small"
            round="xsmall"
            background={
                appearance === "warning" ? "status-warning" : "brand"
            }>
            {appearance === "warning" ? <StatusWarning size="large" /> : <Notification size="large" color="white" />}
            <Box align="center">
                <Text weight="bold" color={appearance !== "warning" ? "white" : "dark-1"}>{children}</Text>
            </Box>
            <Box align="center">
                <Button
                    icon={<FormClose color={appearance !== "warning" ? "white" : "dark-1"} />}
                    plain
                    focusIndicator={false}
                    onClick={onDismiss} />
            </Box>
        </Box>
    </Grommet>
);

export default PushMessageToast;