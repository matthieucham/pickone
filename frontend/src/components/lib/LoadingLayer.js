import React from "react";
import {
    Box, Layer, Text
} from "grommet";
import {
    Launch
} from "grommet-icons";

const LoadingLayer = () => (
    <Layer modal
        animation="fadeIn"
        margin="large"
        responsive={false}
    >
        <Box pad="medium" align="center">
            <Launch size="large" />
            <Text>Loading...</Text>
        </Box>

    </Layer>
)

export default LoadingLayer;