import React, { Component } from 'react';
import {
    Box, Button, Heading, Layer, Text
} from 'grommet';
import { Trash } from 'grommet-icons';


const RemovableItemBox = ({ label, confirmText, onRemove }) => {
    const [openConfirm, setOpenConfirm] = React.useState();
    const onOpenConfirm = () => setOpenConfirm(true);
    const onCloseConfirm = () => setOpenConfirm(undefined);
    const onConfirmAndClose = () => {
        setOpenConfirm(undefined);
        onRemove();
    }
    return (
        <Box pad="none">
            <Box direction="row" pad="xsmall" align="center" border margin="xsmall" background="light-2">
                <Box pad="xsmall"><Text>{label}</Text></Box>
                {onRemove &&
                    <Button raw
                        icon={<Trash />} onClick={confirmText ? onOpenConfirm : onRemove}
                        pad="xsmall"
                        focusIndicator={false}
                        hoverIndicator={true} />
                }
            </Box>
            {openConfirm && (
                <Layer position="center" onClickOutside={onCloseConfirm} onEsc={onCloseConfirm} responsive={false}>
                    <Box pad="medium" gap="small" width="medium">
                        <Heading level={3} margin="none">
                            Confirmation</Heading>
                        <Text>{confirmText}</Text>
                        <Box
                            as="footer"
                            gap="small"
                            direction="row"
                            align="center"
                            justify="end"
                            pad={{ top: 'medium', bottom: 'small' }}
                        >
                            <Button label="Annuler" onClick={onCloseConfirm} color="dark-3" />
                            <Button
                                label={
                                    <Text color="white">
                                        <strong>Supprimer</strong>
                                    </Text>
                                }
                                onClick={onConfirmAndClose}
                                primary
                                color="status-critical"
                            />
                        </Box>
                    </Box>
                </Layer>
            )}
        </Box>
    );
}

export default RemovableItemBox;