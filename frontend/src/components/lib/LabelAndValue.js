import React from "react";
import {
    Box,
    Text
} from "grommet";

const LabelAndValue = ({ label, icon, value, ...props }) =>
    <Box border {...props} direction="row" justify="between" align="center" pad="small" round="xsmall">
        {icon && <Box>{icon}</Box>}
        <Box
            justify="start"
            align="center"
        >
            <Text textAlign="center" size="small">{label}</Text>
            <Text textAlign="center" weight="bold">{value}</Text>
        </Box>
    </Box>

export default LabelAndValue;