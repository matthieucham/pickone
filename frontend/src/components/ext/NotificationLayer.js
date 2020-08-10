import React, { Component } from 'react';
import { Box, Button, Layer, Text } from "grommet";
import { FormClose } from "grommet-icons";

const NotificationLayer = ({ text, icon, status, onClose }) =>
    <Layer
        position="bottom"
        modal={false}
        margin={{ vertical: 'medium', horizontal: 'small' }}
        onEsc={onClose}
        responsive={false}
        plain
    >
        <Box
            align="center"
            direction="row"
            gap="small"
            justify="between"
            round="medium"
            elevation="medium"
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
            background={`status-${status}`}
        >
            <Box align="center" direction="row" gap="xsmall">
                {icon}
                <Text>{text}</Text>
            </Box>
            <Button icon={<FormClose />} onClick={onClose} plain />
        </Box>
    </Layer>

export default NotificationLayer;