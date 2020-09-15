import React from 'react';
import {
    Box, Distribution, Heading, Text
} from 'grommet';

const PickResultPanel = ({ winner, scores }) => {
    let totalVotes = Object.entries(scores).reduce((total, sc) => total + sc[1], 0);

    const distrival = Object.entries(scores).map(
        ([choice, score]) => (
            {
                value: score,
                color: (choice === winner ? 'brand' : 'light-3'),
                label: choice,
                pct: (Math.round(score * 100.0 / totalVotes) / 100) * 100
            }
        ));

    return <Box justify="center" align="center">
        <Box width="medium" align="center">
            <Text>Victoire de ...</Text>
            <Box animation={{
                type: "fadeIn",
                delay: 0,
                duration: 5000
            }}>
                <Heading level="3">{winner}</Heading>
            </Box>
        </Box>
        <Box width="large" align="center" height="medium"
            animation={{
                type: "fadeIn",
                delay: 0,
                duration: 5000
            }}>
            <Distribution values={distrival} fill basis="full">
                {value => (
                    <Box pad="medium" align="center" background={value.color} fill>
                        <Text size="small">{value.label}</Text>
                        <Text weight="bold" size="large">{value.pct} %</Text>
                        <Text size="small">{value.value} voix</Text>
                    </Box>
                )}
            </Distribution>
        </Box>
    </Box>
}

export default PickResultPanel;