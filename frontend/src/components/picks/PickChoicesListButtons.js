import React from "react"
import { Box, Button, Menu, Text } from "grommet";
import { CloudUpload, NewWindow } from "grommet-icons"

export const PickChoicesListMenu = ({ lists, onListSelected }) => {
    return (
        <Menu
            dropProps={
                {
                    align: { bottom: 'bottom', left: 'left' },
                    elevation: "medium"
                }}
            items={
                lists && lists.map(l => (
                    {
                        label: <Box pad="small">
                            <Text>{l.name}</Text>
                        </Box>,
                        onClick: () => onListSelected(l)
                    }))
            }
            icon={<NewWindow />}
            label="Remplir à partir d'une liste prédéfinie"
            hoverIndicator
            size="small"
        >
        </Menu>
    )
}

export const PickChoicesSaveListButton = ({ disabled, onClick }) =>
    <Button plain
        icon={<CloudUpload />}
        label={<Text size="small">Enregistrer comme liste</Text>}
        focusIndicator={false}
        disabled={disabled}
        hoverIndicator
        onClick={onClick}
        reverse />
