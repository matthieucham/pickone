import React from "react";
import {
    Box,
    Text
} from "grommet";

const LabelAndValue = ({ label, value }) =>
    <Box direction="row"
        gap="xsmall"
        justify="start"
        align="center"
    >
        <Text size="small">{label}:</Text>
        <Text>{value}</Text>
    </Box>

export default LabelAndValue;