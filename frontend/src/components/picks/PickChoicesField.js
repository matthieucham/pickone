import React from "react";
import { Box, Text } from "grommet";

import ItemsField from "../fields/ItemsField";
import { PickChoicesListMenu, PickChoicesSaveListButton } from "./PickChoicesListButtons";

const PickChoicesField = ({ lists, onChange, onSaveListButtonClick }) => {
    const [choices, setChoices] = React.useState([]);
    const [edited, setEdited] = React.useState(false);
    const [itemsFieldKey, setItemsFieldKey] = React.useState(undefined);

    return (
        <Box>
            <Box direction="row" align="center" justify="between" wrap>
                <Text>Choix possibles</Text>
                <Box direction="row" gap="xsmall" align="stretch" wrap>
                    {lists &&
                        <PickChoicesListMenu
                            lists={lists}
                            onListSelected={(list) => {
                                setItemsFieldKey("" + new Date().getTime());
                                setChoices(list.choices);
                                setEdited(false);
                            }} />}
                    {choices.length > 0 &&
                        <PickChoicesSaveListButton
                            disabled={!edited}
                            onClick={onSaveListButtonClick} />
                    }
                </Box>
            </Box>
            <ItemsField
                key={itemsFieldKey}
                value={choices}
                onChange={(val) => {
                    setEdited(true);
                    onChange(val);
                }} />
        </Box>
    )
}

export default PickChoicesField;