import React from 'react';
import {
    Anchor,
    Box,
    Text
} from 'grommet';


const About = () =>
    <Box width="large" alignSelf="center" pad="small">
        <Text>J'ai développé ce site en 2020, autour de la technologie Firebase</Text>
        <Text weight="bold">Une question ?</Text>
        <Box direction="row" gap="xsmall">Contactez-moi au travers de ma page<Anchor href="https://www.linkedin.com/in/matthieugrandrie/">Linkedin</Anchor></Box>

    </Box>

export default About;