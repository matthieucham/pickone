import React from 'react';
import { Box, Button, Grommet, Text } from "grommet";
import { FormClose, StatusGood, StatusCritical, StatusWarning, StatusInfo } from "grommet-icons";

const theme = {
    global: {
        font: {
            family: 'Roboto',
            size: '18px',
            height: '20px',
        }
    },
};

const NotificationToast = ({ appearance, children, onDismiss }) => (
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
                appearance === "success" ? "status-ok" : (
                    appearance === "warning" ? "status-warning" : (
                        appearance === "error" ? "status-error" : (
                            appearance === "info" ? "brand" : undefined
                        )
                    )
                )
            }>

            {appearance === "success" && <StatusGood size="large" color="white" />}
            {appearance === "warning" && <StatusWarning size="large" />}
            {appearance === "error" && <StatusCritical size="large" color="white" />}
            {appearance === "info" && <StatusInfo size="large" color="white" />}
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

export default NotificationToast;