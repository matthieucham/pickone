import React, { Component } from 'react';
import {
    Box, Button, Grid, Text, Heading
} from 'grommet';
import { Add, More } from 'grommet-icons';

import { withFirebaseService } from '../../hoc';
import { useHistory } from 'react-router-dom';


const NewPick = (props) => {
    let history = useHistory();
    return (
        <Box pad="small"
            border
            hoverIndicator
            round="small"
            margin="small"
            justify="center"
            align="center"
            height="xsmall"
            onClick={() => { history.push(`/newpick`) }}>
            <Button plain icon={<Add />} label="Nouveau" />
        </Box>);
}

const CurrentPick = ({ pickId, title, description, author, limit, isOwner }) => {

    let history = useHistory();
    return (
        <Box margin="small" justify="center" align="center"
            border
            hoverIndicator
            round="small"
            onClick={() => { history.push(`/pick/${pickId}`) }}
            height="xsmall"
        >
            <Grid rows={["xxxsmall", "auto", "xxxsmall"]}
                columns={["auto", "auto"]}
                gap="none"
                areas={[
                    { name: 'header', start: [0, 0], end: [0, 0] },
                    { name: 'title', start: [0, 1], end: [0, 1] },
                    { name: 'limit', start: [0, 2], end: [0, 2] },
                    { name: 'indic', start: [1, 0], end: [1, 2] },
                ]}
                fill
            >
                <Box gridArea="header" pad="xsmall" fill>
                    <Text size="small">Proposé par {author}</Text>
                </Box>
                <Box gridArea="title" pad="xsmall" justify="center" align="center" fill>
                    <Heading level="4">{title}</Heading>
                </Box>
                <Box gridArea="limit" pad="xsmall" wrap fill>
                    <Text size="small">Vote ouvert jusqu'au {limit}</Text>
                </Box>
                <Box gridArea="indic" pad="xsmall" fill justify="center" align="center">
                    <Button plain icon={<More />} />
                </Box>
            </Grid>
        </Box>)
}


class Dashboard extends Component {
    render() {
        return (
            <Grid
                rows={["1/2", "1/2"]}
                columns={["full"]}
                gap="medium"
                areas={[
                    { name: 'current', start: [0, 0], end: [0, 0] },
                    { name: 'past', start: [0, 1], end: [0, 1] },
                ]}
                fill
            >
                <Box gridArea="current" fill wrap direction="row" alignContent="start" justify="start">
                    <NewPick /> <CurrentPick pickId="TODO" title="Resto ce midi" description="" author="Fred" limit="02/08 12:00" isOwner={false} />
                </Box>
                <Box gridArea="past" fill wrap direction="row" alignContent="start" justify="start" background='light-4'>
                </Box>
            </Grid>)
    }
}

const WrappedComponent = withFirebaseService(Dashboard);
export default WrappedComponent;