import React from 'react';
import {
    Box, Button, Text
} from 'grommet';
import { Trash } from 'grommet-icons';

import ConfirmationLayer from "../lib/ConfirmationLayer";


const RemovableItemBox = ({ label, confirmText, onRemove, ...props }) => {
    const [openConfirm, setOpenConfirm] = React.useState();
    const onOpenConfirm = () => setOpenConfirm(true);
    const onCloseConfirm = () => setOpenConfirm(undefined);
    const onConfirmAndClose = () => {
        setOpenConfirm(undefined);
        onRemove();
    }
    return (
        <Box>
            <Box direction="row" pad="xsmall" align="center" border margin="xsmall" background="light-2" {...props}>
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
                <ConfirmationLayer onCancelAction={onCloseConfirm} onConfirmAction={onConfirmAndClose}
                    title="Confirmation" text={confirmText} actionLabel="Supprimer" />
            )}
        </Box>
    );
}

export default RemovableItemBox;