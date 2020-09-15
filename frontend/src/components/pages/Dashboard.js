import React, { Component } from 'react';
import {
    Box, Button
} from 'grommet';
import { AddCircle } from 'grommet-icons';

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

import RegistrationsList from "../picks/RegistrationsList";

class Dashboard extends Component {

    render() {
        const { userId, registrations } = this.props;
        return (
            <Box align="center">
                <Box pad="medium" width="medium" align="center">
                    <Button label="Nouveau vote" icon={<AddCircle />} onClick={() => { this.props.history.push("/newpick") }} />
                </Box>
                <Box>
                    <RegistrationsList registrations={registrations} userId={userId} />
                </Box>
            </Box>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        registrations: state.firestore.ordered.registrations
    }

}

export default compose(
    firestoreConnect((props) => {
        return [
            {
                collection: "registrations",
                where: ['userId', '==', props.userId],
                orderBy: ['pickDate', 'desc']
            }
        ]
    }),
    connect(mapStateToProps)
)(Dashboard);