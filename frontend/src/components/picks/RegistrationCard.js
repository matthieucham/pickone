import React from 'react'
import dayjs from 'dayjs';
import {
    Box, Button, Card, CardHeader, CardBody, CardFooter, Text
} from 'grommet';
import { StatusDisabled, StatusInfo, StatusUnknown, User } from 'grommet-icons';
import { useHistory } from "react-router-dom"


const RegistrationCard = ({ registration }) => {
    let history = useHistory();
    const { pickId, pickTitle, status, pickDate, pickAuthor } = registration;
    const user = { name: "TODO", id: "TODO" };
    return (
        <Card key={pickId} height="small" width="medium" background="light-1" margin="xsmall"
            onClick={() => { history.push(`/pick/${pickId}`) }}>
            <CardHeader pad="small">
                <Text size="small">{dayjs.unix(pickDate.seconds).format('DD/MM/YYYY')}</Text>
                {(status === "TERMINATED") ? (
                    <StatusInfo color="brand" />
                )
                    : (
                        (status === "CANCELLED") ? (
                            <StatusDisabled color="status-warning" />
                        ) : (
                                <StatusUnknown color="status-ok" />
                            )
                    )
                }
            </CardHeader>
            <CardBody pad="small" align="center" justify="center">
                <Text weight="bold">{pickTitle}</Text>
            </CardBody>
            <CardFooter pad="small" background="light-2">
                <Button
                    icon={<User />}
                    label={
                        <Text size="small" weight={pickAuthor.id === user.id ? "bold" : "normal"}>
                            {pickAuthor.name}</Text>
                    }
                    plain />
                {(status === "TERMINATED") ? (
                    <Box background="brand"
                        round="xsmall"
                        pad="xsmall">
                        <Text size="small" weight="bold">Terminé</Text>
                    </Box>
                )
                    : (
                        (status === "CANCELLED") ? (
                            <Box background="status-warning"
                                round="xsmall"
                                pad="xsmall">
                                <Text size="small" weight="bold">Annulé</Text>
                            </Box>
                        ) : (
                                <Box background="status-ok"
                                    round="xsmall"
                                    pad="xsmall">
                                    <Text size="small" weight="bold">En cours</Text>
                                </Box>
                            )
                    )
                }
            </CardFooter>
        </Card>
    )
}

export default RegistrationCard
