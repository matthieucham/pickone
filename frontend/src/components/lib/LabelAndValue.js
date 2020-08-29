import React from "react";
import {
    Box,
    Text
} from "grommet";

const LabelAndValue = ({ label, icon, value, ...props }) =>
    <Box background="light-2" direction="row" justify="between" align="center" pad="small"{...props} >
        <Box
            justify="start"
            align="center"
        >
            <Text textAlign="center" size="small">{label}</Text>
            <Box direction="row" >
                {icon && <Box pad="xsmall">{icon}</Box>}
                <Text textAlign="center" weight="bold">{value}</Text>
            </Box>
        </Box>
    </Box>

export default LabelAndValue;