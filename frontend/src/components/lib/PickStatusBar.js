import React, { Component } from "react"
import {
    Box,
    Button,
    Text
} from "grommet"
import { InProgress, Scorecard, Clear } from "grommet-icons";
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

const PickStatusBar = ({ pick, onClosePick, onCancelPick }) => {
    const status = {
        color: pick.cancelled ? "status-warning" : (
            pick.result ? "status-unknown" : "status-ok"),
        icon: pick.cancelled ? <Clear /> : (
            pick.result ? <Scorecard /> : <InProgress />),
        label: pick.cancelled ? "Vote annulé" : (
            pick.result ? "Résultat" : "Vote en cours"
        )
    }

    return (
        <Box margin="none"
            fill="horizontal"
            pad={{ vertical: "small", horizontal: "small" }}
            background={status.color}
            direction="row"
            justify="between"
            wrap>
            <Box direction="row" gap="small" align="center" justify="center">
                <Text>{status.label}</Text>
                {status.icon}
            </Box>
            {!pick.cancelled && !pick.result &&
                <Box align="center" justify="center">
                    <Text size="small">Code de partage</Text>
                    <Text><strong>{pick.key}</strong></Text>
                </Box>
            }

            {!pick.cancelled && !pick.result &&
                <Box
                    color="white"
                    align="center"
                    pad="small"
                    gap="small">

                    {onClosePick &&
                        <CloseButton
                            label="Terminer"
                            onClose={onClosePick}
                            primary
                            color="status-unknown"
                            size="large"
                            disabled={!pick.voters}
                        />}
                    {onCancelPick &&
                        <CancelButton label="Annuler le vote" onCancel={onCancelPick} size="small" color="status-warning" />}
                </Box>}

        </Box>
    );
}

export default PickStatusBar;