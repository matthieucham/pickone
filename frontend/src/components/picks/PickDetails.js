import React from 'react';
import dayjs from 'dayjs';
import {
    Box, Heading, List, Text
} from 'grommet';
import { Clear, InProgress, Scorecard } from "grommet-icons";


import PickControlPanel from "../picks/PickControlPanel";
import PickCodeDisplay from "../picks/PickCodeDisplay";
import PickVotersMenu from "../picks/PickVotersMenu";
import OpenPickForm from "../picks/OpenPickForm";
import PickResultPanel from "../picks/PickResultPanel";

const PickDetails = ({ userId, pickId, pick, vote, disabled, onSubmit, onResolve, onCancel }) => {
    const isOrga = pick.author.id === userId
    const status = {
        color: pick.cancelled ? "status-warning" : (
            pick.result ? "brand" : "status-ok"),
        icon: pick.cancelled ? <Clear size="small" /> : (
            pick.result ? <Scorecard size="small" /> : <InProgress size="small" />),
        label: pick.cancelled ? "Annulé" : (
            pick.result ? "Terminé" : "En cours"
        )
    }
    return (
        <Box direction="row-reverse" wrap justify="between" gap="small">
            <Box align="center" flex={{ grow: 1, shrink: 0 }} pad="small">
                <Heading level="3">{pick.title}</Heading>
                <Box pad="small"><Text>{pick.description}</Text></Box>
                {
                    !pick.result && !pick.cancelled &&
                    <OpenPickForm
                        pick={pick}
                        values={vote ? vote.choices : []}
                        suggest={pick.suggest}
                        multiple={pick.multiple}
                        disabled={disabled}
                        onSubmit={onSubmit} />
                }
                {
                    pick.cancelled &&
                    <Box justify="center">
                        <Text weight="bold">Vote annulé par l'organisateur</Text>
                        <Text size="small">Parce que la démocratie, c'est très surfait</Text>
                    </Box>
                }
                {
                    pick.result && !pick.cancelled &&
                    <PickResultPanel winner={pick.result.winner} scores={pick.result.scores} />
                }
            </Box>

            <Box align="center" flex={{ grow: 0, shrink: 0 }} pad="small">
                {!pick.cancelled && !pick.result &&
                    <PickCodeDisplay code={pick.key} background="dark-2" />
                }
                <List
                    primaryKey={(item) => <Text key={item.key}>{item.label}</Text>}
                    secondaryKey={
                        (item) => {
                            if (item.content) {
                                return item.content
                            } else {
                                if (item.color) {
                                    return <Text key={"sk" + item.key} weight="bold" color={item.color}>{item.value}</Text>
                                } else {
                                    return <Text key={"sk" + item.key} weight="bold">{item.value}</Text>
                                }
                            }
                        }
                    }
                    data={
                        [
                            { key: "status", label: "Statut", value: status.label, color: status.color },
                            { key: "date", label: "Date", value: dayjs.unix(pick.dateCreated.seconds).format('DD/MM/YYYY') },
                            { key: "orga", label: "Organisateur", value: pick.author.name },
                            { key: "mode", label: "Mode d'élection", value: pick.mode === "random" ? "Au hasard" : "A la majorité" },
                            {
                                key: "voters",
                                label: "Votants",
                                content: <PickVotersMenu key="vbvoters"
                                    pickId={pickId}
                                    userId={userId}
                                    voters={pick.voters}
                                    hideAction={!isOrga || pick.result || pick.cancelled} />
                            },
                        ]
                    }
                    margin="small"
                />
                {
                    isOrga && !pick.result && !pick.cancelled &&
                    <PickControlPanel
                        border round="xsmall" elevation="small"
                        margin="small"
                        pick={pick}
                        onClosePick={onResolve}
                        onCancelPick={onCancel} />
                }
            </Box>

        </Box>)
}

export default PickDetails;