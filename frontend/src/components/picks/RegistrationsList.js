import React from 'react'

import RegistrationCard from "./RegistrationCard";
import {
    Box
} from 'grommet';


const RegistrationsList = ({ registrations, userId }) => {
    return (
        <Box direction="row" gap="small" align="center" justify="start" wrap>
            {
                registrations && registrations.map(
                    (reg) => (
                        <RegistrationCard registration={reg} key={reg.pickId} userId={userId} />
                    )
                )
            }
        </Box>
    )
}

export default RegistrationsList;