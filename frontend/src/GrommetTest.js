import React from "react";

import { Grommet, List } from "grommet";

const Demo = (props) => {
    const data = [
        { label: "a" },
        { label: "b" },
        { label: "c" }];

    return (
        <Grommet><List data={data} primaryKey="label"
            onClickItem={(e) => { console.log(e.item.label) }} />
        </Grommet>
    )
}

export default Demo;