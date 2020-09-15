import React from "react";

import { AccordionPanel, Box, Text } from "grommet";
import { FormEdit, FormTrash } from "grommet-icons";

import { RouterButton } from "../ext/RoutedControls";
import { ChoicesListPanelTrashButton } from "./ChoicesListPanelTrashButton";

export const ChoicesListPanel = ({ list, onDelete }) => {
    return (
        <AccordionPanel
            label={
                <Box pad="small"><Text weight="bold">{list.name}</Text></Box>
            }
            background="light-2">
            <Box direction="row" pad="xsmall" align="center" justify="between">
                <Box direction="row" justify="start" wrap>
                    {list.choices.map((ch, idx) =>
                        <Box key={`ap${list.id}_${idx}`} pad="xsmall">
                            <Text size="small">{ch}</Text>
                        </Box>)}
                </Box>
                <Box direction="row" gap="small">
                    <RouterButton
                        path={`/editlist/${list.id}`}
                        icon={<FormEdit />}
                        plain />
                    <ChoicesListPanelTrashButton
                        icon={<FormTrash />}
                        list={list}
                        onDelete={onDelete}
                        plain />
                </Box>
            </Box>
        </AccordionPanel>
    )
}
