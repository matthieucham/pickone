import React from "react";

import { Accordion } from "grommet";

import { ChoicesListPanel } from "./ChoicesListPanel";


export const ChoicesListsAccordion = ({ lists, onDelete }) => {
    return (<Accordion pad="small" fill="horizontal">
        {
            lists && lists.map(l => <ChoicesListPanel key={`ap${l.id}`} list={l} onDelete={onDelete} />)
        }
    </Accordion>)
}