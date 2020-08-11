import React, { Component } from "react"
import {
    Box,
    Button,
    Text
} from "grommet"
import { InProgress, Scorecard, Clear } from "grommet-icons";


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
            <Box direction="row" gap="small" align="center">
                <Text>{status.label}</Text>
                {status.icon}
            </Box>
            <Box align="center" justify="center">
                <Text size="small">Code de partage</Text>
                <Text><strong>{pick.key}</strong></Text>
            </Box>

            {!pick.cancelled && !pick.result &&
                <Box
                    color="white"
                    align="center"
                    pad="small"
                    gap="small">

                    {onClosePick &&
                        <Button
                            label="Terminer"
                            onClick={onClosePick}
                            primary
                            color="status-unknown"
                            size="large"
                        />}
                    {onCancelPick &&
                        <Button label="Annuler" onClick={onCancelPick} size="small" color="status-warning" />}
                </Box>}

        </Box>
    );
}

export default PickStatusBar;