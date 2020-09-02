import React from "react";

import { Box, Button, List, Stack, Text } from "grommet";
import { Copy } from "grommet-icons"


const PickCodeDisplay = ({ code, ...props }) => {
    const [copied, setCopied] = React.useState(undefined);

    const copyToClipboard = (val) => {
        var dummy = document.createElement("input");
        //dummy.setAttribute("hidden", true);
        document.body.appendChild(dummy);
        dummy.setAttribute("id", "dummy_id");
        document.getElementById("dummy_id").value = val;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

    //  Create an anchor element (note: no need to append this element to the document)
    const url = document.createElement('a');
    //  Set href to any path
    url.setAttribute('href', window.location.href);
    const sharingCodeUrl = url.protocol + '://' + url.hostname + (url.port ? ':' + url.port : '') + '/?__sharing_code=' + code;
    return (

        <Box {...props}>
            <List primaryKey={(item) => <Text size="small" key={item.key}>{item.label}</Text>}
                secondaryKey={(item) => <Text size="small" key={"sk" + item.key} weight="bold">{item.value}</Text>}
                data={
                    [
                        { key: "code", label: "Code de partage", value: code },
                        { key: "url", label: "Accès direct", value: sharingCodeUrl }
                    ]
                }
                action={(item, index) => {
                    return (
                        <Box key={"act" + item.key} justify="center" align="center">
                            <Stack anchor="bottom-right">
                                <Button plain
                                    key={index}
                                    icon={<Copy />}
                                    hoverIndicator
                                    onClick={() => { copyToClipboard(item.value); setCopied(index) }}
                                />
                                {copied === index &&
                                    <Box round="xsmall" background="brand">
                                        <Text size="xsmall">Copié</Text>
                                    </Box>

                                }
                            </Stack>
                        </Box>
                    );
                }}
            />

        </Box>
    )
}

export default PickCodeDisplay;