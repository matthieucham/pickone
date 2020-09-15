import React from "react"
import {
    Box,
    Button,
    Text
} from "grommet"
import ConfirmationLayer from "../lib/ConfirmationLayer";


const CloseButton = ({ onClose, ...props }) => {
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const onCloseConfirm = () => setOpenConfirm(false);
    const onConfirmAndClose = () => {
        setOpenConfirm(false);
        onClose();
    }
    return <Box>
        <Button onClick={() => setOpenConfirm(true)} {...props}></Button>
        {openConfirm && (
            <ConfirmationLayer
                onCancelAction={onCloseConfirm}
                onConfirmAction={onConfirmAndClose}
                title="Confirmation"
                text={`Mettre fin au vote et découvrir le résultat ?`}
                actionLabel="Oui, terminer" cancelLabel="Non, pas encore" />
        )}
    </Box>
}

const CancelButton = ({ onCancel, ...props }) => {
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const onCloseConfirm = () => setOpenConfirm(false);
    const onConfirmAndClose = () => {
        setOpenConfirm(false);
        onCancel();
    }
    return <Box>
        <Button onClick={() => setOpenConfirm(true)} {...props}></Button>
        {openConfirm && (
            <ConfirmationLayer
                onCancelAction={onCloseConfirm}
                onConfirmAction={onConfirmAndClose}
                title="Confirmation"
                text={`Annuler le vote ? Plus personne ne pourra voter et le résultat ne sera jamais connu`}
                actionLabel="Oui, annuler" cancelLabel="Non" />
        )}
    </Box>
}

const PickControlPanel = ({ pick, onClosePick, onCancelPick, ...props }) => {

    return (
        <Box {...props}>
            <Box align="center" pad="small" gap="small" width="medium" >
                <Text>Vous êtes l'organisateur</Text>
                <Box direction="row-responsive" align="center" gap="small">
                    {onClosePick &&
                        <CloseButton
                            label="Terminer et voir le résultat"
                            onClose={onClosePick}
                            primary
                            disabled={!pick.voters}
                        />}
                    {onCancelPick &&
                        <CancelButton label="Annuler le vote" onCancel={onCancelPick} />}
                </Box>
            </Box>
        </Box>
    )
}

export default PickControlPanel;