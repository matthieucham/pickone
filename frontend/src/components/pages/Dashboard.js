import React, { Component } from 'react';
import dayjs from 'dayjs';
import {
    Box, Button, Card, CardHeader, CardBody, CardFooter, Text
} from 'grommet';
import { StatusDisabled, StatusInfo, StatusUnknown, User } from 'grommet-icons';

import { withFirebaseService } from '../../hoc';
import { withRouter } from 'react-router-dom';

class Dashboard extends Component {

    state = {
        picks: [],
    }

    componentDidMount() {
        this._isMounted = true;
        const user = this.props.user;
        this._isMounted && this.props.FirebaseService.getDb().collection('registrations/')
            .where('userId', '==', user.id)
            .orderBy('pickDate', 'desc')
            .onSnapshot(querySnapshot => {
                let open = querySnapshot.docs.map(doc => doc.data());
                this._isMounted && this.setState({
                    openPicks: open.filter(p => !p.status),
                    terminatedPicks: open.filter(p => p.status === "TERMINATED"),
                    picks: open
                });
                return null;
            });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { picks } = this.state;
        const { user } = this.props;
        return (
            <Box direction="row-responsive" gap="small" align="center" justify="start" wrap>
                {
                    picks.map(
                        ({ pickId, pickTitle, status, pickDate, pickAuthor }) => (
                            <Card key={pickId} height="small" width="medium" background="light-1" margin="xsmall"
                                onClick={() => { this.props.history.push(`/pick/${pickId}`) }}>
                                <CardHeader pad="small">
                                    <Text size="small">{dayjs(pickDate).format('DD/MM/YYYY')}</Text>
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
                    )
                }
            </Box>
            // <Grid
            //     rows={["1/2", "1/2"]}
            //     columns={["full"]}
            //     gap="medium"
            //     areas={[
            //         { name: 'current', start: [0, 0], end: [0, 0] },
            //         { name: 'past', start: [0, 1], end: [0, 1] },
            //     ]}
            //     fill
            // >
            //     <Box gridArea="current" fill wrap direction="row" alignContent="start" justify="start">
            //         <NewPick />
            //         {opicks}
            //     </Box>
            //     <Box gridArea="past" fill wrap direction="row" alignContent="start" justify="start" background='light-4'>
            //         {tpicks}
            //     </Box>
            // </Grid>
        )
    }
}

const WrappedComponent = withFirebaseService(withRouter(Dashboard));
export default WrappedComponent;