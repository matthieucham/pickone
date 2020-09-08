import React from 'react'

import RegistrationCard from "./RegistrationCard";
import {
    Box
} from 'grommet';


const RegistrationsList = ({ registrations }) => {
    return (
        <Box direction="row" gap="small" align="center" justify="start" wrap>
            {
                registrations && registrations.map(
                    (reg) => (
                        <RegistrationCard registration={reg} key={reg.pickId} />
                    )
                )
            }
        </Box>
    )
}

export default RegistrationsList;