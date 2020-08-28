import React from "react";

import { Box, Button, Stack, Text } from "grommet";
import { Copy } from "grommet-icons"


const PickCodeDisplay = ({ code, ...props }) => {
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = (val) => {
        var dummy = document.createElement("input");
        //dummy.setAttribute("hidden", true);
        document.body.appendChild(dummy);
        dummy.setAttribute("id", "dummy_id");
        document.getElementById("dummy_id").value = val;
        dummy.select();
        document.execCommand("copy");
        console.log("copied", val);
        document.body.removeChild(dummy);
    }

    return (
        <Box {...props}>
            <Box align="center" pad="xsmall">
                <Text textAlign="center">Code de partage</Text>
                <Box direction="row" align="center" gap="xsmall">
                    <Box pad="small">
                        <Text textAlign="center" weight="bold" size="large">{code}</Text>
                    </Box>
                    <Box pad="small">
                        <Button plain icon={<Copy />} hoverIndicator onClick={() => { copyToClipboard(code); setCopied(true) }} />
                        {copied &&
                            <Stack anchor="bottom-right">
                                <Box round="xsmall" background="brand">
                                    <Text size="xsmall">Copié</Text>
                                </Box>
                            </Stack>
                        }
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default PickCodeDisplay;