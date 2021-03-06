import React from 'react';
import {
    Box, Button, Heading, Layer, Text
} from 'grommet';

const ConfirmationLayer = ({ title, text, actionLabel, cancelLabel, onConfirmAction, onCancelAction }) => (
    <Layer position="center" onClickOutside={onCancelAction} onEsc={onCancelAction}>
        <Box pad="medium" gap="small" width="medium">
            <Heading level={3} margin="none">{title}</Heading>
            <Text>{text}</Text>
            <Box
                as="footer"
                gap="small"
                direction="row"
                align="center"
                justify="end"
                pad={{ top: 'medium', bottom: 'small' }}
            >
                <Button label={cancelLabel || "Annuler"} onClick={onCancelAction} color="dark-3" />
                <Button
                    label={
                        <Text color="white">
                            <strong>{actionLabel}</strong>
                        </Text>
                    }
                    onClick={onConfirmAction}
                    primary
                    color="status-critical"
                />
            </Box>
        </Box>
    </Layer>
)

export default ConfirmationLayer;