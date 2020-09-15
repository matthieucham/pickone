import React from "react";

import { Box, Button } from "grommet";
import ConfirmationLayer from "../lib/ConfirmationLayer";

export const ChoicesListPanelTrashButton = ({ list, onDelete, ...props }) => {
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const onCloseConfirm = () => setOpenConfirm(false);
    const onConfirmAndDelete = () => {
        setOpenConfirm(false);
        onDelete(list);
    }
    return <Box>
        <Button onClick={() => setOpenConfirm(true)} {...props}></Button>
        {openConfirm && (
            <ConfirmationLayer
                onCancelAction={onCloseConfirm}
                onConfirmAction={onConfirmAndDelete}
                title="Confirmation"
                text={`Supprimer la liste ${list.name} ?`}
                actionLabel="Confirmer" cancelLabel="Annuler" />
        )}
    </Box>
}